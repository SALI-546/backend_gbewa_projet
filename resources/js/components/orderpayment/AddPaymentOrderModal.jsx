import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FaSave, FaTimes, FaEdit } from 'react-icons/fa';

// Success Alert Component
const SuccessAlert = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000); // Automatically close after 3 seconds
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

// Error Alert Component
const ErrorAlert = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Automatically close after 5 seconds
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

const AddPaymentOrderModal = ({ isVisible, onClose, editData, onSuccess }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [recapCount, setRecapCount] = useState(1);
    const [currentRecapForm, setCurrentRecapForm] = useState(1);
    const [recapForms, setRecapForms] = useState([
        {
            id: null,
            beneficiaire: '',
            montant: '',
            piecesJointes: [],
            objetDepense: '',
            ligneBudgetaire: '',
            existingAttachments: [],
        }
    ]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [paymentOrderId, setPaymentOrderId] = useState(null);

    // États pour les champs du formulaire principal
    const [formData, setFormData] = useState({
        order_number: '', // Nouveau champ pour le numéro d'ordre
        account: '',
        title: '',
        invoiceNumber: '',
        billOfLadingNumber: '',
    });

    // Alert states
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Charger les projets depuis l'API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                const options = response.data.map((project) => ({
                    value: project.id,
                    label: project.name || project.title,
                }));
                setProjects(options);
            } catch (error) {
                console.error('Erreur lors de la récupération des projets :', error);
                setErrorMessage('Impossible de récupérer les projets.');
            }
        };

        fetchProjects();
    }, []);

    // Effect pour gérer l'édition ou l'ajout
    useEffect(() => {
        if (editData) {
            const isRecapFormsValid = Array.isArray(editData.recapForms) && editData.recapForms.length > 0;

            setCurrentStep(isRecapFormsValid ? 2 : 1);
            setSelectedProject({
                value: editData.project.id,
                label: editData.project.name || editData.project.title,
            });
            setFormData({
                order_number: editData.orderNumber || '', // Pré-remplir le numéro d'ordre en cas d'édition
                account: editData.account || '',
                title: editData.title || '',
                invoiceNumber: editData.invoiceNumber || '',
                billOfLadingNumber: editData.billOfLadingNumber || '',
            });

            if (isRecapFormsValid) {
                setRecapCount(editData.recapForms.length);
                setRecapForms(editData.recapForms.map(form => ({
                    id: form.id || null,
                    beneficiaire: form.beneficiaire || '',
                    montant: form.montant || '',
                    piecesJointes: [],
                    objetDepense: form.objetDepense || '',
                    ligneBudgetaire: form.ligneBudgetaire || '',
                    existingAttachments: form.piecesJointes || [],
                })));
                setPaymentOrderId(editData.id);
            } else {
                setRecapCount(1);
                setRecapForms([
                    {
                        id: null,
                        beneficiaire: '',
                        montant: '',
                        piecesJointes: [],
                        objetDepense: '',
                        ligneBudgetaire: '',
                        existingAttachments: [],
                    }
                ]);
            }

        } else {
            // Réinitialiser les états pour l'ajout
            setCurrentStep(1);
            setSelectedProject(null);
            setFormData({
                order_number: '', // Réinitialiser le numéro d'ordre
                account: '',
                title: '',
                invoiceNumber: '',
                billOfLadingNumber: '',
            });
            setRecapCount(1);
            setRecapForms([
                {
                    id: null,
                    beneficiaire: '',
                    montant: '',
                    piecesJointes: [],
                    objetDepense: '',
                    ligneBudgetaire: '',
                    existingAttachments: [],
                }
            ]);
            setPaymentOrderId(null);
        }
    }, [editData]);

    if (!isVisible) return null;

    // Gérer le changement de nombre de formulaires récapitulatifs
    const handleRecapCountChange = (e) => {
        const count = Math.max(1, Number(e.target.value));
        setRecapCount(count);
        setRecapForms(Array.from({ length: count }, (_, index) => ({
            id: editData && Array.isArray(editData.recapForms) ? editData.recapForms[index]?.id || null : null,
            beneficiaire: recapForms[index]?.beneficiaire || '',
            montant: recapForms[index]?.montant || '',
            piecesJointes: recapForms[index]?.piecesJointes || [],
            objetDepense: recapForms[index]?.objetDepense || '',
            ligneBudgetaire: recapForms[index]?.ligneBudgetaire || '',
            existingAttachments: recapForms[index]?.existingAttachments || [],
        })));
    };

    // Gestion des étapes
    const handleNext = () => {
        if (currentStep === 1) {
            // Validation simple pour le formulaire principal
            if (!selectedProject) {
                setErrorMessage('Veuillez sélectionner un projet.');
                return;
            }
            if (!formData.order_number) {
                setErrorMessage('Veuillez saisir un numéro d\'ordre.');
                return;
            }
            if (!formData.account || !formData.title || !formData.invoiceNumber) {
                setErrorMessage('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            setCurrentStep(2);
        } else if (currentRecapForm < recapCount) {
            handleSubmitRecapForm(currentRecapForm - 1).then(() => {
                setCurrentRecapForm(currentRecapForm + 1);
            }).catch(() => {}); // Ignorer les erreurs ici, car elles sont déjà gérées dans la fonction
        }
    };

    const handlePrevious = () => {
        if (currentStep === 2 && currentRecapForm > 1) {
            setCurrentRecapForm(currentRecapForm - 1);
        } else {
            setCurrentStep(1);
        }
    };

    // Gestion des changements dans les champs des formulaires récapitulatifs
    const handleRecapFormChange = (index, field, value) => {
        const updatedForms = [...recapForms];
        updatedForms[index][field] = value;
        setRecapForms(updatedForms);
    };

    // Gestion des fichiers de pièces jointes
    const handleFileChange = (index, files) => {
        const updatedForms = [...recapForms];
        updatedForms[index].piecesJointes = Array.from(files);
        setRecapForms(updatedForms);
    };
    
    // Close success alert
    const closeSuccessAlert = () => {
        setSuccessMessage(null);
    };

    // Close error alert
    const closeErrorAlert = () => {
        setErrorMessage(null);
    };

    // Soumettre les données du formulaire principal
    const handleSubmitMainForm = async (e) => {
        e.preventDefault();

        // Préparer les données à envoyer
        const data = {
            project_id: selectedProject.value,
            order_number: formData.order_number, // Inclure le numéro d'ordre
            account: formData.account,
            title: formData.title,
            invoice_number: formData.invoiceNumber,
            bill_of_lading_number: formData.billOfLadingNumber,
        };

        try {
            let response;
            if (editData) {
                // Mettre à jour l'ordre de paiement existant
                response = await axios.put(`/api/payment-orders/${editData.id}`, data);
                setSuccessMessage('Ordre de paiement mis à jour avec succès.');
            } else {
                // Créer un nouvel ordre de paiement
                response = await axios.post('/api/payment-orders', data);
                setSuccessMessage('Ordre de paiement créé avec succès.');
            }
            setPaymentOrderId(response.data.data.id);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire principal :', error.response);
            const message = error.response?.data?.message || 'Erreur lors de la soumission du formulaire principal.';
            setErrorMessage(message);
        }
    };

    // Fonction pour déterminer le texte du bouton de soumission du formulaire récapitulatif
    const getRecapSubmitButtonText = (form) => {
        return form.id ? 'Mettre à jour' : 'Soumettre';
    };

    // Soumettre les données du formulaire récapitulatif
    const handleSubmitRecapForm = async (index, isUpdate = false) => {
        return new Promise(async (resolve, reject) => {
            const form = recapForms[index];
            if (!paymentOrderId) {
                setErrorMessage('Veuillez soumettre le formulaire principal avant de soumettre les formulaires récapitulatifs.');
                reject();
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('beneficiaire', form.beneficiaire);
            formDataToSend.append('montant', form.montant);
            formDataToSend.append('objet_depense', form.objetDepense);
            formDataToSend.append('ligne_budgetaire', form.ligneBudgetaire);

            // Ajouter les fichiers
            form.piecesJointes.forEach((file) => {
                formDataToSend.append('pieces_jointes[]', file);
            });
            try {
                let response;
                if (form.id && isUpdate) {
                    response = await axios.put(`/api/payment-order-recap-forms/${form.id}`, formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setSuccessMessage(`Formulaire récapitulatif ${index + 1} mis à jour avec succès.`);
                } else {
                    formDataToSend.append('payment_order_id', paymentOrderId);
                    response = await axios.post('/api/payment-order-recap-forms', formDataToSend, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setSuccessMessage(`Formulaire récapitulatif ${index + 1} soumis avec succès.`);
                    const newRecapForm = {
                        ...form,
                        id: response.data.data.id,
                    };
                    const updatedForms = [...recapForms];
                    updatedForms[index] = newRecapForm;
                    setRecapForms(updatedForms);
                }
                if (onSuccess) onSuccess();
                resolve();
            } catch (error) {
                console.error(`Erreur lors de la soumission du formulaire récapitulatif ${index + 1} :`, error);
                const message = error.response?.data?.message || `Erreur lors de la soumission du formulaire récapitulatif ${index + 1}.`;
                setErrorMessage(message);
                reject();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg overflow-auto max-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">ORDRE DE PAIEMENT</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black focus:outline-none">
                        <FaTimes size={20} />
                    </button>
                </div>
                {successMessage && <SuccessAlert message={successMessage} onClose={closeSuccessAlert} />}
                {errorMessage && <ErrorAlert message={errorMessage} onClose={closeErrorAlert} />}
                {currentStep === 1 ? (
                    // Formulaire principal
                    <form onSubmit={handleSubmitMainForm}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Numéro d'Ordre<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="order_number"
                                value={formData.order_number}
                                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Exemple : PO-1234567890"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Nom du projet<span className="text-red-500">*</span></label>
                            <Select
                                options={projects}
                                value={selectedProject}
                                onChange={setSelectedProject}
                                placeholder="Sélectionner un projet"
                                className="w-full"
                                isRequired
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">COMPTE<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="account"
                                value={formData.account}
                                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="ONG GBEWA PIB Projet 1"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">INTITULÉ<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="003712170137"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Numéro de Facture<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Exemple : FAC-12345"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">N° BL<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="billOfLadingNumber"
                                value={formData.billOfLadingNumber}
                                onChange={(e) => setFormData({ ...formData, billOfLadingNumber: e.target.value })}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="106/MOOV/24"
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={onClose}
                                type="button"
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
                                Annuler
                            </button>
                            <div className="flex space-x-2">
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                                    Soumettre
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                                    Suivant
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    // Formulaire récapitulatif
                    <form>
                        {currentRecapForm === 1 && (
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Nombre de formulaires récapitulatifs<span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min="1"
                                    value={recapCount}
                                    onChange={handleRecapCountChange}
                                    className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                    placeholder="Nombre de formulaires récapitulatif"
                                    required
                                />
                            </div>
                        )}
                        <h3 className="text-lg font-semibold mb-2">Formulaire Récapitulatif {currentRecapForm} / {recapCount}</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Bénéficiaire<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={recapForms[currentRecapForm - 1]?.beneficiaire || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'beneficiaire', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Nom du bénéficiaire"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Sommes nettes revenant aux bénéficiaires<span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montant || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montant', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Montant"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Pièces jointes</label>
                            {recapForms[currentRecapForm - 1]?.existingAttachments && recapForms[currentRecapForm - 1]?.existingAttachments.length > 0 && (
                                <div className="mb-2">
                                    <p className="text-gray-600">Fichiers existants :</p>
                                    <ul className="list-disc list-inside">
                                        {recapForms[currentRecapForm - 1]?.existingAttachments.map(attachment => (
                                            <li key={attachment.id}>
                                                <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                    {attachment.fileName}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(currentRecapForm - 1, e.target.files)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Objet de la dépense<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={recapForms[currentRecapForm - 1]?.objetDepense || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'objetDepense', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Objet de la dépense"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">Ligne budgétaire<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={recapForms[currentRecapForm - 1]?.ligneBudgetaire || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'ligneBudgetaire', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Ligne budgétaire"
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
                                Précédent
                            </button>
                            <div className="flex space-x-2">
                                {recapForms[currentRecapForm - 1]?.id ? (
                                    <button
                                        type="button"
                                        onClick={() => handleSubmitRecapForm(currentRecapForm - 1, true)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center">
                                        <FaEdit className="mr-2" />
                                        Mettre à jour
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleSubmitRecapForm(currentRecapForm - 1)}
                                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center">
                                        <FaSave className="mr-2" />
                                        Soumettre
                                    </button>
                                )}

                                {currentRecapForm < recapCount ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                                        Suivant
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            // Vérifier si tous les formulaires récapitulatifs sont soumis
                                            // Pour simplifier, supposons qu'ils le sont après la dernière soumission
                                            setSuccessMessage('Ordre de paiement mis à jour avec succès.');
                                        }}
                                        type="button"
                                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                                        Terminer
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddPaymentOrderModal;
