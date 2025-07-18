import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from '../../config/config';
import { usePermission } from '../../rbac/userPermissions';
import { useNavigate } from 'react-router-dom';

function LinksDashboard() {
    const [errors, setErrors] = useState({});
    const [linksData, setLinksData] = useState([]);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const permission = usePermission();

    const handleShowDeleteModal = (linkId) => {
        setFormData({
            id: linkId
        });
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${serverEndpoint}/links/${formData.id}`, {
                withCredentials: true
            });
            await fetchLinks();
            handleCloseDeleteModal();
        } catch (error) {
            setErrors({ message: 'Unable to delete the link, please try again' });
        }
    };

    const handleOpenModal = (isEdit, data = {}) => {
        if (isEdit) {
            setFormData({
                id: data._id,
                campaignTitle: data.campaignTitle,
                originalUrl: data.originalUrl,
                category: data.category
            });
        }

        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [formData, setFormData] = useState({
        campaignTitle: "",
        originalUrl: "",
        category: ""
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (formData.campaignTitle.length === 0) {
            newErrors.campaignTitle = "Campaign Title is mandatory";
            isValid = false;
        }

        if (formData.originalUrl.length === 0) {
            newErrors.originalUrl = "URL is mandatory";
            isValid = false;
        }

        if (formData.category.length === 0) {
            newErrors.category = "Category is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            const body = {
                campaign_title: formData.campaignTitle,
                original_url: formData.originalUrl,
                category: formData.category
            };
            const configuration = {
                withCredentials: true
            };
            try {
                if (isEdit) {
                    await axios.put(
                        `${serverEndpoint}/links/${formData.id}`,
                        body, configuration);
                } else {
                    await axios.post(
                        `${serverEndpoint}/links`,
                        body, configuration);
                }

                await fetchLinks();
                setFormData({
                    campaignTitle: "",
                    originalUrl: "",
                    category: ""
                });
            } catch (error) {
                setErrors({ message: 'Unable to add the Link, please try again' });
            } finally {
                handleCloseModal();
            }
        }
    };

    const fetchLinks = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/links`, {
                withCredentials: true
            });
            setLinksData(response.data.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch links at the moment. Please try again' });
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const columns = [
        { field: 'campaignTitle', headerName: 'Campaign', flex: 2 },
        {
            field: 'originalUrl', headerName: 'URL', flex: 3, renderCell: (params) => (
                <>
                    <a href={`${serverEndpoint}/links/r/${params.row._id}`}
                        target='_blank'
                        rel="noopener noreferrer"
                    >
                        {params.row.originalUrl}
                    </a>
                </>
            )
        },
        { field: 'category', headerName: 'Category', flex: 2 },
        { field: 'clickCount', headerName: 'Clicks', flex: 1 },
        {
            field: 'action', headerName: 'Clicks', flex: 1, renderCell: (params) => (
                <>
                    {permission.canEditLink && (
                        <IconButton>
                            <EditIcon onClick={() => handleOpenModal(true, params.row)} />
                        </IconButton>
                    )}

                    {permission.canDeleteLink && (
                        <IconButton>
                            <DeleteIcon onClick={() => handleShowDeleteModal(params.row._id)} />
                        </IconButton>
                    )}

                    {permission.canViewLink && (
                        <IconButton>
                            <AssessmentIcon onClick={() => {
                                navigate(`/analytics/${params.row._id}`);
                            }} />
                        </IconButton>
                    )}
                </>
            )
        },
    ];

    return (
        <Box className="dashboard-fullpage" sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Paper elevation={2} sx={{ mb: 3, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkIcon color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" component="h2" fontWeight={700} color="primary.main">
                        Manage Affiliate Links
                    </Typography>
                </Box>
                {permission.canCreateLink && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        color="primary"
                        onClick={() => handleOpenModal(false)}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                    >
                        Add
                    </Button>
                )}
            </Paper>
            {errors.message && (
                <Box sx={{ mb: 2 }}>
                    <Typography color="error" variant="body2" role="alert">
                        {errors.message}
                    </Typography>
                </Box>
            )}
            <Paper elevation={1} sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, mb: 3 }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={linksData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 20, page: 0 }
                        }
                    }}
                    pageSizeOptions={[20, 50, 100]}
                    disableRowSelectionOnClick
                    sx={{
                        fontFamily: 'inherit',
                        background: 'transparent',
                        borderRadius: 'var(--border-radius)'
                    }}
                    density='compact'
                />
            </Paper>
            {/* Add/Edit Dialog */}
            <Dialog open={showModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ background: 'var(--header-gradient)', color: '#fff' }}>
                    {isEdit ? 'Update Link' : 'Add Link'}
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Campaign Title"
                            name="campaignTitle"
                            value={formData.campaignTitle}
                            onChange={handleChange}
                            error={!!errors.campaignTitle}
                            helperText={errors.campaignTitle}
                            fullWidth
                        />
                        <TextField
                            label="URL"
                            name="originalUrl"
                            value={formData.originalUrl}
                            onChange={handleChange}
                            error={!!errors.originalUrl}
                            helperText={errors.originalUrl}
                            fullWidth
                        />
                        <TextField
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            error={!!errors.category}
                            helperText={errors.category}
                            fullWidth
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 1, fontWeight: 600 }}>
                            {isEdit ? 'Update' : 'Add'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            {/* Delete Dialog */}
            <Dialog open={showDeleteModal} onClose={handleCloseDeleteModal} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ background: 'var(--header-gradient)', color: '#fff' }}>Delete Link</DialogTitle>
                <DialogContent>
                    <Typography align="center" sx={{ my: 2 }}>
                        Are you sure you want to delete this link?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontWeight: 600 }}>
                        Delete
                    </Button>
                    <Button onClick={handleCloseDeleteModal} variant="outlined" color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default LinksDashboard;