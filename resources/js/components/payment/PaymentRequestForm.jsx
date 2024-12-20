// PaymentRequestForm.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

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
    const [orderNumber, setOrderNumber] = useState(''); // Ajout de l'état pour le numéro d'ordre

    const [recapForms, setRecapForms] = useState([]);

    // États pour les alertes
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    // Charger les projets depuis l'API
    useEffect(() => {
        fetch('/api/projects')
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((project) => ({
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
        fetch('/api/users')
            .then((response) => response.json())
            .then((data) => {
                const options = data.map((user) => ({
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
            setOrderNumber(editData.orderNumber || ''); // Utiliser camelCase
            setOperation(editData.operation || '');
            setBeneficiary(editData.beneficiary || '');
            setInvoiceDetails(editData.invoiceDetails || '');
            setBudgetLine(editData.budgetLine || '');
            setFollowedBy({
                value: editData.followedBy?.id,
                label: editData.followedBy?.name,
            });
            setQuality(editData.quality || '');

            // Initialiser les formulaires récapitulatifs si disponibles
            if (editData.recapForms && editData.recapForms.length > 0) {
                setRecapForms(editData.recapForms.map(form => ({
                    id: form.id, // Ajouter l'ID pour les formulaires existants
                    activite: form.activite,
                    montantPresenteTotal: form.montantPresenteTotal,
                    montantPresenteEligible: form.montantPresenteEligible,
                    montantSollicite: form.montantSollicite,
                    attachments: form.attachments || [], // Pièces jointes existantes
                    newAttachments: [] // Pièces jointes nouvelles
                })));
            } else {
                setRecapForms([{
                    id: null,
                    activite: '',
                    montantPresenteTotal: '',
                    montantPresenteEligible: '',
                    montantSollicite: '',
                    attachments: [],
                    newAttachments: []
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
            setRecapForms([{
                id: null,
                activite: '',
                montantPresenteTotal: '',
                montantPresenteEligible: '',
                montantSollicite: '',
                attachments: [],
                newAttachments: []
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
            attachments: [],
            newAttachments: []
        }]);
    };

    // Fonction pour supprimer un formulaire récapitulatif
    const handleRemoveRecapForm = (index) => {
        const updatedForms = [...recapForms];
        updatedForms.splice(index, 1);
        setRecapForms(updatedForms);
    };

    // Fonction pour gérer les changements dans les formulaires récapitulatifs
    const handleRecapFormChange = (index, field, value) => {
        const updatedForms = [...recapForms];
        updatedForms[index][field] = value;
        setRecapForms(updatedForms);
    };

    // Fonction pour gérer les changements dans les fichiers
    const handleFileChange = (index, files) => {
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        const updatedForms = [...recapForms];
        const validFiles = [];

        for (let i = 0; i < files.length; i++) {
            if (allowedTypes.includes(files[i].type)) {
                validFiles.push(files[i]);
            } else {
                alert(`Le fichier ${files[i].name} n'est pas un type autorisé.`);
            }
        }

        // Ajouter les fichiers valides aux nouvelles pièces jointes
        updatedForms[index].newAttachments = [...updatedForms[index].newAttachments, ...validFiles];
        setRecapForms(updatedForms);
    };

    // Fonctions pour fermer les alertes
    const closeSuccessAlert = () => {
        setSuccessMessage(null);
    };

    const closeErrorAlert = () => {
        setErrorMessage(null);
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProject) {
            alert('Veuillez sélectionner un projet.');
            return;
        }

        if (!orderNumber) {
            alert('Veuillez saisir un numéro d\'ordre.');
            return;
        }

        // Valider que tous les formulaires récapitulatifs sont remplis
        for (let i = 0; i < recapForms.length; i++) {
            const form = recapForms[i];
            if (
                !form.activite ||
                form.montantPresenteTotal === '' ||
                form.montantPresenteEligible === '' ||
                form.montantSollicite === ''
            ) {
                alert(`Veuillez remplir tous les champs du formulaire récapitulatif ${i + 1}.`);
                return;
            }
        }

        try {
            // Préparer les données
            const formData = new FormData();
            formData.append('project_id', selectedProject.value);
            formData.append('order_number', orderNumber); // Inclusion du numéro d'ordre
            formData.append('operation', operation);
            formData.append('beneficiary', beneficiary);
            formData.append('invoice_details', invoiceDetails);
            formData.append('budget_line', budgetLine);
            if (followedBy) formData.append('followed_by_id', followedBy.value);
            formData.append('quality', quality);

            recapForms.forEach((form, index) => {
                if (form.id) {
                    formData.append(`recap_forms[${index}][id]`, form.id);
                }
                formData.append(`recap_forms[${index}][activite]`, form.activite);
                formData.append(`recap_forms[${index}][montant_presente_total]`, form.montantPresenteTotal);
                formData.append(`recap_forms[${index}][montant_presente_eligible]`, form.montantPresenteEligible);
                formData.append(`recap_forms[${index}][montant_sollicite]`, form.montantSollicite);

                // Ajouter uniquement les nouvelles pièces jointes
                form.newAttachments.forEach((file) => {
                    formData.append(`recap_forms[${index}][attachments][]`, file);
                });
            });

            // Déterminer la méthode et l'URL en fonction du mode (création ou modification)
            const method = editData ? 'patch' : 'post';
            const url = editData ? `/api/payment-requests/${editData.id}` : '/api/payment-requests';

            console.log('Méthode:', method);
            console.log('URL:', url);

            console.log('Données envoyées:', Array.from(formData.entries())); // Log pour débogage

            const response = await axios({
                method: method,
                url: url,
                data: formData,
                headers: {
                    'Accept': 'application/json',
                    // 'Content-Type': 'multipart/form-data', // Retirer ce header pour laisser Axios le gérer
                },
            });

            setSuccessMessage(editData ? 'Demande de paiement mise à jour avec succès.' : 'Demande de paiement créée avec succès.');
            onClose();
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire:', error);
            if (editData) {
                // Gestion des erreurs lors de la mise à jour
                if (error.response && error.response.data && error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                    setErrorMessage('Erreur lors de la mise à jour de la demande de paiement:\n' + errorMessages);
                } else {
                    setErrorMessage('Erreur lors de la mise à jour de la demande de paiement: ' + error.message);
                }
            } else {
                // Gestion des erreurs lors de la création
                if (error.response && error.response.data && error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                    setErrorMessage('Erreur lors de la soumission du formulaire:\n' + errorMessages);
                } else {
                    setErrorMessage('Erreur lors de la soumission du formulaire: ' + error.message);
                }
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
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
                <form onSubmit={handleSubmit}>
                    {/* Formulaire principal */}
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

                    {/* Formulaires récapitulatifs */}
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold mb-2">Formulaires Récapitulatifs</h3>
                        {recapForms.map((form, index) => (
                            <div key={index} className="border border-gray-300 p-3 rounded mb-3 relative">
                                {recapForms.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRecapForm(index)}
                                        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                                <h4 className="text-md font-medium mb-1">Formulaire {index + 1}</h4>
                                <div className="mb-2">
                                    <label className="block text-gray-700 font-medium mb-0.5">Activité</label>
                                    <input
                                        type="text"
                                        value={form.activite}
                                        onChange={(e) => handleRecapFormChange(index, 'activite', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                                        placeholder="Description de l'activité"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 font-medium mb-0.5">Montant présenté (en coût total)</label>
                                    <input
                                        type="number"
                                        value={form.montantPresenteTotal}
                                        onChange={(e) => handleRecapFormChange(index, 'montantPresenteTotal', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                                        placeholder="Montant total"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 font-medium mb-0.5">Montant présenté (en coût total éligible)</label>
                                    <input
                                        type="number"
                                        value={form.montantPresenteEligible}
                                        onChange={(e) => handleRecapFormChange(index, 'montantPresenteEligible', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                                        placeholder="Montant éligible"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 font-medium mb-0.5">Montant sollicité (A-B)</label>
                                    <input
                                        type="number"
                                        value={form.montantSollicite}
                                        onChange={(e) => handleRecapFormChange(index, 'montantSollicite', e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                                        placeholder="Montant sollicité"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700 font-medium mb-0.5">Pièces jointes</label>
                                    
                                    {/* Afficher les pièces jointes existantes */}
                                    {form.attachments.length > 0 && (
                                        <ul className="mt-1 list-disc list-inside">
                                            {form.attachments.map((file, idx) => (
                                                <li key={idx}>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {file.fileName} {/* Utiliser camelCase */}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
                                        onChange={(e) => handleFileChange(index, e.target.files)}
                                        className="w-full border border-gray-300 rounded px-3 py-1.5 mt-1"
                                    />
                                    
                                    {/* Afficher les nouvelles pièces jointes */}
                                    {form.newAttachments.length > 0 && (
                                        <ul className="mt-1 list-disc list-inside">
                                            {form.newAttachments.map((file, idx) => (
                                                <li key={idx}>
                                                    {file instanceof File ? (
                                                        file.name
                                                    ) : (
                                                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                            {file.fileName}
                                                        </a>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddRecapForm}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded"
                        >
                            Ajouter un formulaire récapitulatif
                        </button>
                    </div>

                    {/* Boutons de soumission */}
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-3 rounded"
                        >
                            {editData ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default PaymentRequestForm;
