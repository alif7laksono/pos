import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import axios from 'axios';
import { getToken, getEmployeeId } from '@/commons/authService';

const AddEditProductModal = ({ isOpen, handleClose, product, isEditing, fetchProducts }) => {
    const [formData, setFormData] = useState({
        productCode: '',
        productName: '',
        productDescription: '',
        price: '',
        stock: '',
        discount: '',
    });

    useEffect(() => {
        if (isEditing && product) {
            setFormData({
                productCode: product.productCode,
                productName: product.productName,
                productDescription: product.productDescription,
                price: product.price,
                stock: product.stock,
                discount: product.discount,
            });
        } else {
            setFormData({
                productCode: '',
                productName: '',
                productDescription: '',
                price: '',
                stock: '',
                discount: '',
            });
        }
    }, [isEditing, product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const jwtToken = await getToken();
            const url = 'https://b97c-36-71-84-137.ngrok-free.app/Gateway/api/Product/SubmitProduct';

            const body = {
                ...formData,
                inventoryId: isEditing ? product.inventoryId : 0
            };

            const headers = {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': "69420"
            };

            const response = await axios.post(url, body, { headers });
            if (response.data.code === 1) {
                fetchProducts();
                handleClose();
            } else {
                console.error('Unexpected response code:', response.data.code);
            }
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <Dialog open={isOpen} handler={handleClose}>
            <DialogHeader>
                {isEditing ? 'Edit Product' : 'Add Product'}
            </DialogHeader>
            <DialogBody divider>
                <div className="flex flex-col gap-4">
                    <Input label="Product Code" name="productCode" value={formData.productCode} onChange={handleChange} />
                    <Input label="Product Name" name="productName" value={formData.productName} onChange={handleChange} />
                    <Input label="Product Description" name="productDescription" value={formData.productDescription} onChange={handleChange} />
                    <Input label="Price" type="number" name="price" value={formData.price} onChange={handleChange} />
                    <Input label="Stock" type="number" name="stock" value={formData.stock} onChange={handleChange} />
                    <Input label="Discount" type="number" name="discount" value={formData.discount} onChange={handleChange} />
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleClose} className="mr-1">
                    <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleSubmit}>
                    <span>{isEditing ? 'Save Changes' : 'Add Product'}</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default AddEditProductModal;
