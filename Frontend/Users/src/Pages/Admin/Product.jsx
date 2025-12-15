import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/Admin/Sidebar.jsx';
import Header from '../../Components/Admin/Header.jsx';
import { productAPI, categoryAPI } from '../../Services/api.js';

function Product() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      console.log('Products fetched:', response);
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (err) {
      setError(err.message);
      alert(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      console.log('Categories fetched:', response);
      if (response.success && response.data) {
        setCategories(response.data.map(cat => cat.name));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadProductImage = async (file) => {
    if (!file) return null;
    const res = await productAPI.upload(file);
    if (res.success && res.url) {
      return res.url;
    }
    throw new Error(res.message || 'Image upload failed');
  };
  
  const handleAddProduct = async (newProduct) => {
    const isEdit = Boolean(editingProduct);
    const file = newProduct.file;

    let uploadedUrl = null;
    try {
      if (file) {
        uploadedUrl = await uploadProductImage(file);
      }
    } catch (uploadErr) {
      console.error('Upload failed:', uploadErr);
      Swal.fire({
        icon: 'error',
        title: 'Image upload failed',
        text: uploadErr.message || 'Please try again.',
        confirmButtonColor: '#DC2626',
      });
      return;
    }

    const existingImage = editingProduct?.image || '';
    const imageUrl = removeImage ? '' : (uploadedUrl || newProduct.imageUrl || existingImage);
    const fallbackImage = existingImage || '📦';

    if (isEdit) {
      const updatePayload = {
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock || 0),
        category: newProduct.category,
        image_url: imageUrl,
        status: newProduct.status || 'Active',
      };

      try {
        const res = await productAPI.update(editingProduct.id, updatePayload);
        if (res.success && res.data) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? res.data : p)));
        } else {
          setProducts(
            products.map((p) =>
              p.id === editingProduct.id
                ? { ...updatePayload, id: editingProduct.id, image: imageUrl || fallbackImage }
                : p
            )
          );
        }
        Swal.fire({
          icon: 'success',
          title: 'Product updated',
          text: `${newProduct.name} has been updated.`,
          confirmButtonColor: '#4F46E5',
          confirmButtonText: 'Great!',
          showCloseButton: true,
        });
      } catch (err) {
        console.error('Error updating product:', err);
        Swal.fire({
          icon: 'error',
          title: 'Failed to update product',
          text: err.message || 'Please try again.',
          confirmButtonColor: '#DC2626',
        });
      } finally {
        setEditingProduct(null);
        setIsModalOpen(false);
        setPreviewImage(null);
        setRemoveImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      return;
    }

    // Create new product via API
    const payload = {
      name: newProduct.name,
      description: newProduct.description || '',
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock || 0),
      category: newProduct.category,
      image_url: imageUrl,
      status: newProduct.status || 'Active',
    };

    try {
      const res = await productAPI.create(payload);
      if (res.success && res.data) {
        setProducts([...products, res.data]);
      } else {
        setProducts([...products, { ...payload, id: Date.now(), image: fallbackImage }]);
      }
      Swal.fire({
        icon: 'success',
        title: 'Product added',
        text: `${newProduct.name} has been added successfully.`,
        confirmButtonColor: '#4F46E5',
        confirmButtonText: 'Great!',
        showCloseButton: true,
      });
    } catch (err) {
      console.error('Error creating product:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to add product',
        text: err.message || 'Please try again.',
        confirmButtonColor: '#DC2626',
      });
    } finally {
      setIsModalOpen(false);
      setPreviewImage(null);
      setRemoveImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteProduct = (id) => {
    const product = products.find((p) => p.id === id);

    Swal.fire({
      title: 'Delete product?',
      text: product ? `This will remove ${product.name}.` : 'This will remove the product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        productAPI.remove(id)
          .then(() => {
            setProducts(products.filter((p) => p.id !== id));
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'The product has been removed.',
              confirmButtonColor: '#4F46E5',
              confirmButtonText: 'OK',
            });
          })
          .catch((err) => {
            console.error('Error deleting product:', err);
            Swal.fire({
              icon: 'error',
              title: 'Failed to delete',
              text: err.message || 'Please try again.',
              confirmButtonColor: '#DC2626',
            });
          });
      }
    });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setPreviewImage(product.image && product.image.startsWith('http') ? product.image : null);
    setRemoveImage(false);
    setIsModalOpen(true);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'name' || sortField === 'category') {
        aVal = aVal?.toLowerCase() || '';
        bVal = bVal?.toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Render modal as a plain function to avoid remounting and losing form input values on image selection
  const renderProductModal = () => (
    <div className="p-4 fixed inset-0 backdrop-blur-sm bg-opacity-20 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
        <div className="sticky top-0 bg-linear-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
                const file = fileInputRef.current?.files?.[0] || null;
            handleAddProduct({
              name: formData.get('name'),
              description: formData.get('description'),
              category: formData.get('category'),
              price: parseFloat(formData.get('price')),
              stock: parseInt(formData.get('stock')),
              rating: parseFloat(formData.get('rating')),
              status: formData.get('status'),
              dateAdded: formData.get('dateAdded'),
                  imageUrl: editingProduct?.image && editingProduct.image.startsWith('http') ? editingProduct.image : '',
                  file,
            });
          }}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              defaultValue={editingProduct?.name || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              defaultValue={editingProduct?.description || ''}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter product description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              name="category"
              defaultValue={editingProduct?.category || 'Electronics'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                defaultValue={editingProduct?.price || ''}
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                defaultValue={editingProduct?.stock || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (previewImage) {
                    try { URL.revokeObjectURL(previewImage); } catch {}
                  }
                  const url = URL.createObjectURL(file);
                  setPreviewImage(url);
                  setRemoveImage(false);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ref={fileInputRef}
            />
            {previewImage ? (
              <div className="mt-2 relative">
                <p className="text-xs text-gray-500 mb-1">Preview</p>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (previewImage) {
                      try { URL.revokeObjectURL(previewImage); } catch {}
                    }
                    setPreviewImage(null);
                    setRemoveImage(true);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-600 border border-gray-200 rounded-md px-2 py-1 text-xs font-medium shadow-sm transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              editingProduct?.image && editingProduct.image.startsWith('http') && !removeImage && (
                <div className="mt-2 relative">
                  <p className="text-xs text-gray-500 mb-1">Current Image</p>
                  <img
                    src={editingProduct.image}
                    alt="Current"
                    className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setRemoveImage(true);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-600 border border-gray-200 rounded-md px-2 py-1 text-xs font-medium shadow-sm transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
                setPreviewImage(null);
                setRemoveImage(false);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
            >
              {editingProduct ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <Sidebar activeItem="products" />
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out max-h-screen overflow-auto">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600 text-sm mt-1">{filteredProducts.length} products total</p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setPreviewImage(null);
                  setRemoveImage(false);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus size={20} />
                <span className="font-medium">Add Product</span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg animate-in fade-in delay-100">
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th
                      onClick={() => handleSort('name')}
                      className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        Product <SortIcon field="name" />
                      </div>
                    </th>
                    <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th
                      onClick={() => handleSort('price')}
                      className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        Price <SortIcon field="price" />
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('stock')}
                      className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        Stock <SortIcon field="stock" />
                      </div>
                    </th>
                    <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:block">
                            <p className="font-medium text-gray-900">{product.name}</p>
                          </div>
                          <div className="sm:hidden">
                            <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 sm:w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(product.stock / 5, 100)}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-gray-600 text-xs sm:text-sm">{product.stock}</span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-gray-900 font-medium">{product.rating}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          } transition-all duration-200`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex gap-1 sm:gap-2">
                          <button className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 sm:p-2 rounded transition-colors duration-200">
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-1 sm:p-2 rounded transition-colors duration-200"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900 hover:bg-red-50 p-1 sm:p-2 rounded transition-colors duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && renderProductModal()}
    </div>
  );
}

export default Product;