// PaymentRequestForm.jsx

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import RecapForm from './RecapForm';

// Composant d'Alerte de Succès
const SuccessAlert = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Fermer automatiquement après 3 secondes
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={onClose}>
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        </div>
    );
};

// Composant d'Alerte d'Erreur
const ErrorAlert = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Fermer automatiquement après 5 secondes
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={onClose}>
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                </svg>
            </span>
        </div>
    );
};

const PaymentRequestForm = ({ onClose, editData }) => {
    // États pour les champs du formulaire principal
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectsOptions, setProjectsOptions] = useState([]);
    const [operation, setOperation] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [invoiceDetails, setInvoiceDetails] = useState('');
    const [budgetLine, setBudgetLine] = useState('');
    const [followedBy, setFollowedBy] = useState(null);
    const [usersOptions, setUsersOptions] = useState([]);
    const [quality, setQuality] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [date, setDate] = useState('');

    const [recapForms, setRecapForms] = useState([]);

    // États pour les alertes
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Charger les projets depuis l'API
    useEffect(() => {
        axios.get('/api/projects')
            .then((response) => {
                const options = response.data.map(project => ({
                    value: project.id,
                    label: project.name || project.title,
                }));
                setProjectsOptions(options);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des projets :', error);
                setErrorMessage('Impossible de récupérer les projets.');
            });
    }, []);

    // Charger les utilisateurs depuis l'API
    useEffect(() => {
        axios.get('/api/users')
            .then((response) => {
                const options = response.data.map(user => ({
                    value: user.id,
                    label: user.name,
                }));
                setUsersOptions(options);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
                setErrorMessage('Impossible de récupérer les utilisateurs.');
            });
    }, []);

    // Charger les données de modification si disponibles
    useEffect(() => {
        if (editData) {
            setSelectedProject({
                value: editData.project.id,
                label: editData.project.name || editData.project.title,
            });
            setOrderNumber(editData.orderNumber || '');
            setOperation(editData.operation || '');
            setBeneficiary(editData.beneficiary || '');
            setInvoiceDetails(editData.invoiceDetails || '');
            setBudgetLine(editData.budgetLine || '');
            setFollowedBy({
                value: editData.followedBy?.id || null,
                label: editData.followedBy?.name || '',
            });
            setQuality(editData.quality || '');
            setDate(editData.date ? editData.date.split('T')[0] : '');

            // Initialiser les formulaires récapitulatifs si disponibles
            if (editData.recapForms && editData.recapForms.length > 0) {
                setRecapForms(editData.recapForms.map(form => ({
                    id: form.id, // Ajouter l'ID pour les formulaires existants
                    activite: form.activite,
                    montantPresenteTotal: form.montantPresenteTotal,
                    montantPresenteEligible: form.montantPresenteEligible,
                    montantSollicite: form.montantSollicite,
                    payment_request_id: editData.id, // Assurez-vous d'avoir cet ID
                    existingAttachments: form.attachments || [], // Pièces jointes existantes pour affichage
                })));
            } else {
                setRecapForms([{
                    id: null,
                    activite: '',
                    montantPresenteTotal: '',
                    montantPresenteEligible: '',
                    montantSollicite: '',
                    payment_request_id: editData ? editData.id : null,
                    existingAttachments: [],
                }]);
            }
        } else {
            // Initialiser les états pour la création
            setSelectedProject(null);
            setOrderNumber('');
            setOperation('');
            setBeneficiary('');
            setInvoiceDetails('');
            setBudgetLine('');
            setFollowedBy(null);
            setQuality('');
            setDate('');
            setRecapForms([{
                id: null,
                activite: '',
                montantPresenteTotal: '',
                montantPresenteEligible: '',
                montantSollicite: '',
                payment_request_id: null, // À mettre à jour après la création de la demande de paiement
                existingAttachments: [],
            }]);
        }
    }, [editData]);

    // Fonction pour ajouter un formulaire récapitulatif
    const handleAddRecapForm = () => {
        setRecapForms([...recapForms, {
            id: null,
            activite: '',
            montantPresenteTotal: '',
            montantPresenteEligible: '',
            montantSollicite: '',
            payment_request_id: editData ? editData.id : null,
            existingAttachments: [],
        }]);
    };

    // Fonction pour mettre à jour un formulaire récapitulatif
    const handleUpdateRecapForm = (index, updatedForm) => {
        const updatedForms = [...recapForms];
        updatedForms[index] = updatedForm;
        setRecapForms(updatedForms);
    };

    // Fonction pour supprimer un formulaire récapitulatif
    const handleDeleteRecapForm = async (index, formId) => {
        if (formId) {
            try {
                await axios.delete(`/api/recap-forms/${formId}`);
                console.log(`Formulaire récapitulatif supprimé : ID ${formId}`);
            } catch (error) {
                console.error('Erreur lors de la suppression du formulaire récapitulatif:', error);
                setErrorMessage('Erreur lors de la suppression du formulaire récapitulatif.');
                return; // Arrêter si la suppression a échoué
            }
        }
        // Supprimer localement
        const updatedForms = [...recapForms];
        updatedForms.splice(index, 1);
        setRecapForms(updatedForms);
    };

    // Fonctions pour fermer les alertes
    const closeSuccessAlert = () => {
        setSuccessMessage(null);
    };

    const closeErrorAlert = () => {
        setErrorMessage(null);
    };

    // Fonction pour gérer la soumission du formulaire principal
    const handleSubmitMainForm = async (e) => {
        e.preventDefault();

        // Vérifications préliminaires
        if (!selectedProject) {
            setErrorMessage('Veuillez sélectionner un projet.');
            return;
        }
        if (!orderNumber) {
            setErrorMessage('Veuillez saisir un numéro d\'ordre.');
            return;
        }
        if (!operation) {
            setErrorMessage('Veuillez saisir une opération.');
            return;
        }
        if (!beneficiary) {
            setErrorMessage('Veuillez saisir un bénéficiaire.');
            return;
        }
        if (!invoiceDetails) {
            setErrorMessage('Veuillez saisir les détails de la facture.');
            return;
        }
        if (!budgetLine) {
            setErrorMessage('Veuillez saisir la ligne budgétaire.');
            return;
        }

        try {
            const mainFormData = {
                project_id: selectedProject.value,
                order_number: orderNumber,
                operation: operation,
                beneficiary: beneficiary,
                invoice_details: invoiceDetails,
                budget_line: budgetLine,
                followed_by_id: followedBy ? followedBy.value : null,
                quality: quality,
                date: date,
            };

            // Debug : log des données principales
            console.log('Submitting to URL:', editData ? `/api/payment-requests/${editData.id}` : '/api/payment-requests');
            console.log('Method:', editData ? 'PATCH' : 'POST');
            console.log('Main Form Data:', mainFormData);

            const method = editData ? 'patch' : 'post';
            const url = editData ? `/api/payment-requests/${editData.id}` : '/api/payment-requests';

            const response = await axios({
                method: method,
                url: url,
                data: mainFormData, // Envoi en JSON
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            // Si vous créez une nouvelle demande de paiement, vous aurez besoin de l'ID pour les formulaires récapitulatifs
            const paymentRequestId = editData ? editData.id : response.data.data.id;

            setSuccessMessage(editData ? 'Demande de paiement mise à jour avec succès.' : 'Demande de paiement créée avec succès.');

            // Mettez à jour les formulaires récapitulatifs avec le nouvel ID de demande de paiement si nécessaire
            if (!editData) {
                const updatedRecapForms = recapForms.map(form => ({
                    ...form,
                    payment_request_id: paymentRequestId,
                }));
                setRecapForms(updatedRecapForms);
            }

        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire principal:', error);
            if (error.response) {
                if (error.response.status === 422 && error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                    setErrorMessage('Erreur de validation:\n' + errorMessages);
                } else {
                    setErrorMessage('Erreur lors de la mise à jour de la demande de paiement: ' + error.message);
                }
            } else {
                setErrorMessage('Erreur lors de la soumission du formulaire: ' + error.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">
                        {editData ? 'Modifier Demande de Paiement' : 'Ajouter Demande de Paiement'}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={20} />
                    </button>
                </div>
                {successMessage && <SuccessAlert message={successMessage} onClose={closeSuccessAlert} />}
                {errorMessage && <ErrorAlert message={errorMessage} onClose={closeErrorAlert} />}

                {/* Formulaire Principal */}
                <form onSubmit={handleSubmitMainForm}>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Nom du projet</label>
                        <Select
                            value={selectedProject}
                            onChange={setSelectedProject}
                            options={projectsOptions}
                            placeholder="Sélectionner un projet"
                            className="w-full"
                            isRequired
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Numéro d'Ordre</label>
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="ORD-1234567890"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Intitulé de l'opération</label>
                        <input
                            type="text"
                            value={operation}
                            onChange={(e) => setOperation(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Frais de communication"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Bénéficiaire</label>
                        <input
                            type="text"
                            value={beneficiary}
                            onChange={(e) => setBeneficiary(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="MOOV BENIN"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Numéro et date de la facture</label>
                        <input
                            type="text"
                            value={invoiceDetails}
                            onChange={(e) => setInvoiceDetails(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="EM100234-23 du 12/10/2024"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Ligne Budgétaire</label>
                        <input
                            type="text"
                            value={budgetLine}
                            onChange={(e) => setBudgetLine(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Dotation en communication staff projet, Octobre 2024"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Affaire suivie par</label>
                        <Select
                            value={followedBy}
                            onChange={setFollowedBy}
                            options={usersOptions}
                            placeholder="Sélectionner l'utilisateur qui suit"
                            className="w-full"
                            isClearable
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Qualité</label>
                        <input
                            type="text"
                            value={quality}
                            onChange={(e) => setQuality(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Entrez la qualité"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-gray-700 font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="Date"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-3 rounded"
                        >
                            {editData ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                    </div>
                </form>

                {/* Gestion des Formulaires Récapitulatifs */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Formulaires Récapitulatifs</h3>
                    {recapForms.map((form, index) => (
                        <RecapForm
                            key={form.id || index}
                            form={form}
                            index={index}
                            onUpdate={handleUpdateRecapForm}
                            onDelete={(formId) => handleDeleteRecapForm(index, formId)}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={handleAddRecapForm}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded mt-2"
                    >
                        Ajouter un formulaire récapitulatif
                    </button>
                </div>
            </div>
        </div>
    );

};

export default PaymentRequestForm;
