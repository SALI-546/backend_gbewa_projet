import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { FaTimes } from 'react-icons/fa';

const PaymentRequestForm = ({ onClose, editData }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [recapCount, setRecapCount] = useState(1);
    const [currentRecapForm, setCurrentRecapForm] = useState(1);
    const [recapForms, setRecapForms] = useState([]);

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
    const [paymentRequestId, setPaymentRequestId] = useState(null);

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
            });
    }, []);

    // Charger les données de modification si disponibles
    useEffect(() => {
        if (editData) {
            setSelectedProject({
                value: editData.project.id,
                label: editData.project.name || editData.project.title,
            });
            setOperation(editData.operation || '');
            setBeneficiary(editData.beneficiary || '');
            setInvoiceDetails(editData.invoice_details || '');
            setBudgetLine(editData.budget_line || '');
            setFollowedBy({
                value: editData.followed_by.id,
                label: editData.followed_by.name,
            });
            setQuality(editData.quality || '');
            // Initialiser les formulaires récapitulatifs si disponibles
            if (editData.recap_forms && editData.recap_forms.length > 0) {
                setRecapCount(editData.recap_forms.length);
                setRecapForms(editData.recap_forms.map(form => ({
                    activite: form.activite,
                    montant_presente_total: form.montant_presente_total,
                    montant_presente_eligible: form.montant_presente_eligible,
                    montant_sollicite: form.montant_sollicite,
                    attachments: [] 
                })));
            }
        }
    }, [editData]);

    
    const handleAddOrUpdate = () => {
        if (!selectedProject) {
            alert('Veuillez sélectionner un projet.');
            return;
        }

        
        const data = {
            project_id: selectedProject.value,
            operation: operation,
            beneficiary: beneficiary,
            invoice_details: invoiceDetails,
            budget_line: budgetLine,
            followed_by_id: followedBy ? followedBy.value : null,
            quality: quality,
        };

       
        console.log('Données envoyées:', data);

        
        const method = editData ? 'PUT' : 'POST';
        const url = editData ? `/api/payment-requests/${editData.id}` : '/api/payment-requests';

        fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Une erreur est survenue');
                    });
                }
            })
            .then((data) => {
                setPaymentRequestId(data.id);
                alert(editData ? 'Demande de paiement modifiée avec succès.' : 'Demande de paiement créée avec succès.');
               
                if (editData) {
                    setCurrentStep(2);
                    setRecapForms(Array.from({ length: recapCount }, () => ({
                        activite: '',
                        montant_presente_total: '',
                        montant_presente_eligible: '',
                        montant_sollicite: '',
                        attachments: []
                    })));
                }
            })
            .catch((error) => {
                console.error('Erreur lors de la soumission du formulaire:', error);
                alert(
                    'Erreur lors de la soumission du formulaire: ' + error.message
                );
            });
    };

  
    const handleNext = () => {
        if (currentStep === 1) {
         
            if (!editData && !paymentRequestId) {
                alert("Veuillez soumettre le formulaire principal en cliquant sur 'Ajouter'.");
                return;
            }
            setCurrentStep(2);
            setRecapForms(Array.from({ length: recapCount }, () => ({
                activite: '',
                montant_presente_total: '',
                montant_presente_eligible: '',
                montant_sollicite: '',
                attachments: []
            })));
        } else if (currentRecapForm < recapCount) {
            setCurrentRecapForm(currentRecapForm + 1);
        }
    };

    // Gestion du bouton "Précédent" pour revenir dans les formulaires
    const handlePrevious = () => {
        if (currentStep === 2 && currentRecapForm > 1) {
            setCurrentRecapForm(currentRecapForm - 1);
        } else if (currentStep === 2 && currentRecapForm === 1) {
            setCurrentStep(1);
        }
    };

    // Gestion du champ de saisie de `recapCount`
    const handleRecapCountChange = (e) => {
        const count = Math.max(1, Number(e.target.value));
        setRecapCount(count);
        setRecapForms(Array.from({ length: count }, () => ({
            activite: '',
            montant_presente_total: '',
            montant_presente_eligible: '',
            montant_sollicite: '',
            attachments: []
        })));
    };

    // Gestion des changements dans les champs des formulaires récapitulatifs
    const handleRecapFormChange = (index, field, value) => {
        const updatedForms = [...recapForms];
        updatedForms[index][field] = value;
        setRecapForms(updatedForms);
    };

    // Gestion des fichiers de pièces jointes
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

        updatedForms[index].attachments = validFiles;
        setRecapForms(updatedForms);
    };

    // Fonction pour soumettre les formulaires récapitulatifs
    const handleSubmit = () => {
        if (!paymentRequestId && !editData) {
            alert("Veuillez d'abord créer la demande de paiement en cliquant sur 'Ajouter'.");
            return;
        }

        // Préparer les données à envoyer
        const formData = new FormData();

        formData.append('payment_request_id', paymentRequestId || editData.id);

        // Ajouter les formulaires récapitulatifs
        recapForms.forEach((recapForm, index) => {
            formData.append(`recap_forms[${index}][activite]`, recapForm.activite);
            formData.append(`recap_forms[${index}][montant_presente_total]`, recapForm.montant_presente_total);
            formData.append(`recap_forms[${index}][montant_presente_eligible]`, recapForm.montant_presente_eligible);
            formData.append(`recap_forms[${index}][montant_sollicite]`, recapForm.montant_sollicite);

            // Ajouter les pièces jointes
            recapForm.attachments.forEach((file, fileIndex) => {
                formData.append(`recap_forms[${index}][attachments][${fileIndex}]`, file);
            });
        });

        // Afficher les données pour débogage
        console.log('FormData envoyée:', {
            payment_request_id: paymentRequestId || editData.id,
            recap_forms: recapForms.map(form => ({
                activite: form.activite,
                montant_presente_total: form.montant_presente_total,
                montant_presente_eligible: form.montant_presente_eligible,
                montant_sollicite: form.montant_sollicite,
                attachments: form.attachments.map(file => file.name),
            }))
        });

        // Envoyer les données au backend
        fetch('/api/recap-forms', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Une erreur est survenue');
                    });
                }
            })
            .then((data) => {
                
                alert('Formulaires récapitulatifs soumis avec succès');
                onClose();
            })
            .catch((error) => {
               
                console.error('Erreur lors de la soumission des formulaires récapitulatifs:', error);
                alert(
                    'Erreur lors de la soumission des formulaires récapitulatifs: ' + error.message
                );
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        {editData ? 'Modifier Demande de Paiement' : 'Ajouter Demande de Paiement'}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <FaTimes size={20} />
                    </button>
                </div>
                {currentStep === 1 ? (
                    // Formulaire principal
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Nom du projet</label>
                            <Select
                                value={selectedProject}
                                onChange={setSelectedProject}
                                options={projectsOptions}
                                placeholder="Sélectionner un projet"
                                className="w-full"
                                isRequired
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Intitulé de l'opération</label>
                            <input
                                type="text"
                                value={operation}
                                onChange={(e) => setOperation(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Frais de communication"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Bénéficiaire</label>
                            <input
                                type="text"
                                value={beneficiary}
                                onChange={(e) => setBeneficiary(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="MOOV BENIN"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Numéro et date de la facture</label>
                            <input
                                type="text"
                                value={invoiceDetails}
                                onChange={(e) => setInvoiceDetails(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="EM100234-23 du 12/10/2024"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Ligne Budgétaire</label>
                            <input
                                type="text"
                                value={budgetLine}
                                onChange={(e) => setBudgetLine(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Dotation en communication staff projet, Octobre 2024"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Affaire suivie par</label>
                            <Select
                                value={followedBy}
                                onChange={setFollowedBy}
                                options={usersOptions}
                                placeholder="Sélectionner l'utilisateur qui suit"
                                className="w-full"
                                isClearable
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Qualité</label>
                            <input
                                type="text"
                                value={quality}
                                onChange={(e) => setQuality(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Entrez la qualité"
                            />
                        </div>
                        <div className="flex justify-between mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                            >
                                Annuler
                            </button>
                            <div className="flex space-x-2">
                                {/* Bouton "Ajouter" ou "Mettre à jour" selon le mode */}
                                <button
                                    type="button"
                                    onClick={handleAddOrUpdate}
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                                >
                                    {editData ? 'Mettre à jour' : 'Ajouter'}
                                </button>
                                {/* Bouton "Suivant" */}
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                                >
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
                                <label className="block text-gray-700 font-medium mb-2">Nombre de formulaires récapitulatifs</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={recapCount}
                                    onChange={handleRecapCountChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    placeholder="Nombre de formulaires récapitulatifs"
                                />
                            </div>
                        )}
                        <h3 className="text-lg font-semibold mb-2">Formulaire Récapitulatif {currentRecapForm} / {recapCount}</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Activité</label>
                            <input
                                type="text"
                                value={recapForms[currentRecapForm - 1]?.activite || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'activite', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Description de l'activité"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Montant présenté (en coût total)</label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montant_presente_total || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montant_presente_total', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Montant total"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Montant présenté (en coût total éligible)</label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montant_presente_eligible || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montant_presente_eligible', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Montant éligible"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Montant sollicité (A-B)</label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montant_sollicite || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montant_sollicite', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Montant sollicité"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Pièces jointes</label>
                            <input
                                type="file"
                                multiple
                                accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
                                onChange={(e) => handleFileChange(currentRecapForm - 1, e.target.files)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                            >
                                Précédent
                            </button>
                            {currentRecapForm < recapCount ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                                >
                                    Suivant
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    type="button"
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                                >
                                    Soumettre
                                </button>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PaymentRequestForm;
