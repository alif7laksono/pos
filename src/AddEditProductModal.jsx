import React, { useState, useEffect } from 'react';
import {
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    Button,
    Select,
    Option,
    Typography,
} from "@material-tailwind/react";
import axios from 'axios';
import { getToken, getEmployeeId } from '@/commons/authService';

const AddEditProductModal = ({ isOpen, handleClose, product, isEditing, fetchProducts }) => {
    const [formData, setFormData] = useState({
        inventoryId: 0,
        productId: 0,
        productCode: '',
        productName: '',
        productDescription: '',
        productCategoryId: '',
        images: null,
        stock: 0,
        price: 0,
    });

    const [productCategories, setProductCategories] = useState([]);
    const [isFieldDisabled, setIsFieldDisabled] = useState(false);
    const [categoryValue, setCategoryValue] = React.useState(false);

    useEffect(() => {
        if (isEditing && product) {
            setFormData({
                inventoryId: product.inventoryId || 0,
                productId: product.productId || 0,
                productCode: product.productCode || '',
                productName: product.productName || '',
                productDescription: product.productDescription || '',
                images: product.images || null,
                stock: product.stock || 0,
                price: product.price || 0,
            });
            setCategoryValue(product.productCategoryName);
        } else {
            setFormData({
                inventoryId: 0,
                productId: 0,
                productCode: '',
                productName: '',
                productDescription: '',
                productCategoryId: 1,
                images: null,
                stock: 0,
                price: 0,
            });
        }
    }, [isEditing, product]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jwtToken = await getToken();
                const EmployeeId = await getEmployeeId();

                const url = `${import.meta.env.VITE_API_BASE_URL}/Gateway/api/ProductCategory/GetAll`;

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
                    setProductCategories(response.data.data);
                } else {
                    console.error('Unexpected response code:', response.data.code);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));

        const newValue = name === 'stock' || name === 'price' ? Math.max(0, parseInt(value)) : value;
        setFormData((prevState) => ({ ...prevState, [name]: newValue }));
    };

    const handleBlur = async () => {
        try {
            const response = await getProductByCode(formData.productCode);
            if (response && response.data.code === 1) {
                const productData = response.data.data;
                // Fill other fields with productData
                setFormData(prevState => ({
                    ...prevState,
                    productName: productData.productName,
                    productDescription: productData.productDescription,
                }
                ));
                setCategoryValue(productData.productCategoryName);
                setIsFieldDisabled(true);
            } else {
                setIsFieldDisabled(false);
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getProductByCode = async (code) => {
        const jwtToken = await getToken();
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/Gateway/api/Product/GetByCode`;
            const headers = {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': "69420"
            };

            const body = {
                value: code
            };

            const response = await axios.post(url, body, { headers });
            if (response.data.code === 1) {
                return response;
            } else {
                console.error('Unexpected response code:', response.data.code);
                return response;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleSubmit = async () => {
        try {
            const jwtToken = await getToken();
            const url = `${import.meta.env.VITE_API_BASE_URL}/Gateway/api/Product/Submit`;
            const body = {
                ...formData,
                inventoryId: isEditing ? product.inventoryId : 0,
                productId: isEditing ? product.productId : 0,
                images: isEditing ? product.images : null,
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
        <Dialog size="md" open={isOpen} handler={handleClose}>
            <Card className="mx-auto w-full ">
                <CardHeader
                    color="gray"
                    className="relative h-50 grid place-items-center text-center"
                >
                    <div className="mb-4 h-20 p-6 text-white">
                        <Typography variant="h5" color="white">
                            {isEditing ? 'Edit Product' : 'Add Product'}
                        </Typography>
                    </div>

                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <Input label="Product Code" name="productCode" value={formData.productCode} onChange={handleChange} onBlur={handleBlur} disabled={isFieldDisabled}
                        />
                        <Input label="Product Name" name="productName" value={formData.productName} onChange={handleChange} disabled={isFieldDisabled} />
                        <Input label="Product Description" name="productDescription" value={formData.productDescription} onChange={handleChange} disabled={isFieldDisabled} />

                        <Typography>
                            <Select
                                id="productCategoryId"
                                name="productCategoryId"
                                value={categoryValue}
                                label="Pilih Kategori"
                                onChange={(val) => setCategoryValue(val)}
                                disabled={isFieldDisabled}
                            >
                                {productCategories.length > 0 ? (
                                    productCategories.map(category => (
                                        <Option key={category.id} value={category.categoryName}>
                                            <div className="flex items-center">
                                                {category.categoryName}
                                            </div>
                                        </Option>
                                    ))
                                ) : (
                                    <Option disabled>Loading...</Option>
                                )}
                            </Select>
                        </Typography>
                        <Input label="Stock" type="number" name="stock" value={formData.stock} onChange={handleChange} />
                        <Input label="Price" type="number" name="price" value={formData.price} onChange={handleChange} />

                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload Image</label>
                        <Input className="block w-96 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file" />
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>




                    </div>
                </CardBody>
                <CardFooter>
                    <Button variant="text" color="red" onClick={handleClose} className="mr-1">
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handleSubmit}>
                        <span>{isEditing ? 'Save Changes' : 'Add Product'}</span>
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
};

export default AddEditProductModal;
