import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Typography,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import {
  PencilSquareIcon, TrashIcon, EyeIcon
} from "@heroicons/react/24/solid";
import { getToken, getEmployeeId } from '@/commons/authService';
import AddEditProductModal from "../../AddEditProductModal";

export function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const openAddEditModal = (product = null) => {
    setSelectedProduct(product);
    setIsEditing(!!product);
    setIsAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  const fetchProducts = async () => {
    try {
      const jwtToken = await getToken();
      const EmployeeId = await getEmployeeId();
      const url = `${import.meta.env.VITE_API_BASE_URL}/Gateway/api/Product/GetAll`;

      const headers = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': "69420"
      };

      const body = {
        id: EmployeeId
      };

      const response = await axios.post(url, body, { headers });
      if (response.data.code === 1) {
        setProducts(response.data.data);
      } else {
        console.error('Unexpected response code:', response.data.code);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        const jwtToken = await getToken();
        const url = "https://dacd-36-71-83-123.ngrok-free.app/Gateway/api/Product/Delete/";

        const body = {
          id: selectedProduct.inventoryId
        };

        const headers = {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': "69420"
        };

        const response = await axios.post(url, body, { headers });
        if (response.data.code === 1) {
          setProducts(products.filter(product => product.inventoryId !== selectedProduct.inventoryId));
        } else {
          console.error('Unexpected response code:', response.data.code);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
      closeDeleteModal();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex justify-between items-center">
            <Typography variant="h6" color="white">
              Tabel Product
            </Typography>
            <Button variant="gradient" color="blue" onClick={() => openAddEditModal()}>
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["no", "nama produk", "barcode", "foto", "deskripsi", "stok", "harga", "discount", "action"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const { productName, productCode, productImg, productDescription, stock, price, discount } = product;
                const className = `py-3 px-5 ${index === products.length - 1 ? "" : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={product.productId}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {index + 1}.
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {productName}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-600">
                        {productCode}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-600">
                        {productImg ?? "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {productDescription ?? "N/A"}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-600">
                        {stock}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-600">
                        Rp. {price.toLocaleString()}.00
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-600">
                        {discount}
                      </Typography>
                    </td>
                    <td className={className}>
                      <div className="flex gap-2">
                        <Tooltip content="Edit">
                          <PencilSquareIcon className="h-4 w-4 text-green-500 cursor-pointer" onClick={() => openAddEditModal(product)} />
                        </Tooltip>
                        <Tooltip content="View">
                          <EyeIcon className="h-4 w-4 text-blue-500 cursor-pointer" onClick={() => handleViewClick(product)} />
                        </Tooltip>
                        <Tooltip content="Delete">
                          <TrashIcon className="h-4 w-4 text-red-500 cursor-pointer" onClick={() => handleDeleteClick(product)} />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {selectedProduct && (
        <Dialog open={isDetailModalOpen} handler={closeDetailModal}>
          <DialogHeader>
            {selectedProduct.productName}
          </DialogHeader>
          <DialogBody divider>
            <Typography className="text-sm font-semibold text-blue-gray-600">
              Barcode: {selectedProduct.productCode}
            </Typography>
            <Typography className="text-sm font-semibold text-blue-gray-600">
              Description: {selectedProduct.productDescription}
            </Typography>
            <Typography className="text-sm font-semibold text-blue-gray-600">
              Stock: {selectedProduct.stock}
            </Typography>
            <Typography className="text-sm font-semibold text-blue-gray-600">
              Price: Rp. {selectedProduct.price.toLocaleString()}.00
            </Typography>
            <Typography className="text-sm font-semibold text-blue-gray-600">
              Discount: {selectedProduct.discount}
            </Typography>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={closeDetailModal} className="mr-1">
              <span>Close</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {selectedProduct && (
        <Dialog open={isDeleteModalOpen} handler={closeDeleteModal}>
          <DialogHeader>
            Delete Confirmation
          </DialogHeader>
          <DialogBody divider>
            <Typography className="text-sm font-semibold text-blue-gray-600">
              Are you sure you want to delete "{selectedProduct.productName}"?
            </Typography>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={closeDeleteModal} className="mr-1">
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="red" onClick={handleDeleteConfirm}>
              <span>Delete</span>
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      <AddEditProductModal
        isOpen={isAddEditModalOpen}
        handleClose={closeAddEditModal}
        product={selectedProduct}
        isEditing={isEditing}
        fetchProducts={fetchProducts}
      />
    </div>
  );
}

export default Product;
