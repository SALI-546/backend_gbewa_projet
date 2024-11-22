// AddPaymentOrderModal.jsx

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { FaSave, FaTimes } from 'react-icons/fa';

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
        }
    ]); // Données des formulaires récapitulatifs
    const [projects, setProjects] = useState([]); 
    const [selectedProject, setSelectedProject] = useState(null); 
    const [paymentOrderId, setPaymentOrderId] = useState(null); 

    // États pour les champs du formulaire principal
    const [formData, setFormData] = useState({
        account: '',
        title: '',
        invoice_number: '',
        bill_of_lading_number: '',
    });

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
                alert('Impossible de récupérer les projets.');
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        console.log('Edit Data:', editData);
        if (editData) {
            
            const isRecapFormsValid = Array.isArray(editData.recapForms) && editData.recapForms.length > 0;

            setCurrentStep(isRecapFormsValid ? 2 : 1);
            setSelectedProject({
                value: editData.project.id,
                label: editData.project.name || editData.project.title,
            });
            setFormData({
                account: editData.account || '',
                title: editData.title || '',
                invoice_number: editData.invoice_number || '',
                bill_of_lading_number: editData.bill_of_lading_number || '',
            });
            if (isRecapFormsValid) {
                setRecapCount(editData.recapForms.length);
                setRecapForms(editData.recapForms.map(form => ({
                    id: form.id || null, 
                    beneficiaire: form.beneficiaire || '',
                    montant: form.montant || '',
                    piecesJointes: [], 
                    objetDepense: form.objet_depense || '',
                    ligneBudgetaire: form.ligne_budgetaire || '',
                })));
                setPaymentOrderId(editData.id);
            } else {
                // Si recapForms n'est pas défini ou vide, réinitialiser avec un seul formulaire récapitulatif
                setRecapCount(1);
                setRecapForms([
                    {
                        id: null,
                        beneficiaire: '',
                        montant: '',
                        piecesJointes: [],
                        objetDepense: '',
                        ligneBudgetaire: '',
                    }
                ]);
            }
        } else {
            // Réinitialiser les états pour l'ajout
            setCurrentStep(1);
            setSelectedProject(null);
            setFormData({
                account: '',
                title: '',
                invoice_number: '',
                bill_of_lading_number: '',
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
            ligneBudgetaire: recapForms[index]?.ligneBudgetaire || ''
        })));
    };

    // Gestion des étapes
    const handleNext = () => {
        if (currentStep === 1) {
            // Validation simple pour le formulaire principal
            if (!selectedProject) {
                alert('Veuillez sélectionner un projet.');
                return;
            }
            if (!formData.account || !formData.title || !formData.invoice_number) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            setCurrentStep(2);
        } else if (currentRecapForm < recapCount) {
            setCurrentRecapForm(currentRecapForm + 1);
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

    // Soumettre les données du formulaire principal
    const handleSubmitMainForm = async () => {
        // Préparer les données à envoyer
        const data = {
            project_id: selectedProject.value,
            account: formData.account,
            title: formData.title,
            invoice_number: formData.invoice_number,
            bill_of_lading_number: formData.bill_of_lading_number,
        };

        try {
            let response;
            if (editData) {
                // Mettre à jour l'ordre de paiement existant
                response = await axios.put(`/api/payment-orders/${editData.id}`, data);
                alert('Ordre de paiement mis à jour avec succès.');
            } else {
                // Créer un nouvel ordre de paiement
                response = await axios.post('/api/payment-orders', data);
                alert('Ordre de paiement créé avec succès.');
            }
            setPaymentOrderId(response.data.data.id); 
            onSuccess(); 
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire principal :', error.response);
            const message = error.response?.data?.message || 'Erreur lors de la soumission du formulaire principal.';
            alert(message);
        }
    };

    // Soumettre les données du formulaire récapitulatif
    const handleSubmitRecapForm = async (index) => {
        const form = recapForms[index];

        if (!paymentOrderId) {
            alert('Veuillez soumettre le formulaire principal avant de soumettre les formulaires récapitulatifs.');
            return;
        }

        // Préparer les données à envoyer
        const formDataToSend = new FormData();
        formDataToSend.append('payment_order_id', paymentOrderId);
        formDataToSend.append('beneficiaire', form.beneficiaire);
        formDataToSend.append('montant', form.montant);
        formDataToSend.append('objet_depense', form.objetDepense);
        formDataToSend.append('ligne_budgetaire', form.ligneBudgetaire);

        // Ajouter les fichiers
        form.piecesJointes.forEach((file) => {
            formDataToSend.append('pieces_jointes[]', file);
        });

        try {
            if (form.id) {
                // Mettre à jour un formulaire récapitulatif existant
                await axios.put(`/api/payment-order-recap-forms/${form.id}`, formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert(`Formulaire récapitulatif ${index + 1} mis à jour avec succès.`);
            } else {
                // Créer un nouveau formulaire récapitulatif
                const response = await axios.post('/api/payment-order-recap-forms', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert(`Formulaire récapitulatif ${index + 1} soumis avec succès.`);
                // Optionnel : Mettre à jour l'état avec l'ID retourné
                const newRecapForm = {
                    ...form,
                    id: response.data.data.id,
                };
                const updatedForms = [...recapForms];
                updatedForms[index] = newRecapForm;
                setRecapForms(updatedForms);
            }
            onSuccess(); // Appeler le callback pour rafraîchir la liste
        } catch (error) {
            console.error(`Erreur lors de la soumission du formulaire récapitulatif ${index + 1} :`, error.response);
            const message = error.response?.data?.message || `Erreur lors de la soumission du formulaire récapitulatif ${index + 1}.`;
            alert(message);
        }
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
                {currentStep === 1 ? (
                    // Formulaire principal
                    <form onSubmit={async (e) => { e.preventDefault(); await handleSubmitMainForm(); }}>
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
                                name="invoice_number"
                                value={formData.invoice_number}
                                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Exemple : FAC-12345"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-1">N° BL<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="bill_of_lading_number"
                                value={formData.bill_of_lading_number}
                                onChange={(e) => setFormData({ ...formData, bill_of_lading_number: e.target.value })}
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
                                    placeholder="Nombre de formulaires récapitulatifs"
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
                                <button
                                    type="button"
                                    onClick={() => handleSubmitRecapForm(currentRecapForm - 1)}
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center">
                                    <FaSave className="mr-2" />
                                    Soumettre
                                </button>
                                {currentRecapForm < recapCount ? (
                                    <button 
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                                        Suivant
                                    </button>
                                ) : (
                                    <button 
                                        onClick={onClose}
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
