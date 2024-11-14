import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // Importer react-select

const PaymentRequestForm = ({ onClose, editData }) => {
    const [currentStep, setCurrentStep] = useState(1); // Étape du formulaire principal ou récapitulatif
    const [recapCount, setRecapCount] = useState(1); // Nombre de formulaires récapitulatifs souhaités
    const [currentRecapForm, setCurrentRecapForm] = useState(1); // Formulaire récapitulatif en cours
    const [recapForms, setRecapForms] = useState([]); // Données des formulaires récapitulatifs

    // États pour les champs du formulaire principal
    const [projectName, setProjectName] = useState('');
    const [operationTitle, setOperationTitle] = useState('');
    const [beneficiary, setBeneficiary] = useState('');
    const [invoiceDetails, setInvoiceDetails] = useState('');
    const [budgetLine, setBudgetLine] = useState('');
    const [followedBy, setFollowedBy] = useState(null); // Option sélectionnée pour "Affaire suivie par"
    const [quality, setQuality] = useState(null); // Option sélectionnée pour "Qualité"

    // Options pour react-select
    const followedByOptions = [
        { value: 'A0.12', label: 'A0.12' },
        { value: 'A1.45', label: 'A1.45' },
        { value: 'B3.67', label: 'B3.67' },
    ];

    const qualityOptions = [
        { value: 'SINSIN Daniel', label: 'SINSIN Daniel' },
        { value: 'GNONHOSSOU Brice', label: 'GNONHOSSOU Brice' },
        { value: 'AHOLOU Minhoumon', label: 'AHOLOU Minhoumon' },
    ];

    // Charger les données de modification si disponibles
    useEffect(() => {
        if (editData) {
            setProjectName(editData.designation);
            // Remplir les autres champs si `editData` contient plus d'infos
        }
    }, [editData]);

    // Gestion du bouton "Suivant" pour passer au formulaire récapitulatif
    const handleNext = () => {
        if (currentStep === 1) {
            setCurrentStep(2); // Passe au formulaire récapitulatif
        } else if (currentRecapForm < recapCount) {
            setCurrentRecapForm(currentRecapForm + 1); // Passe au formulaire récapitulatif suivant
        }
    };

    // Gestion du bouton "Précédent" pour revenir dans les formulaires
    const handlePrevious = () => {
        if (currentStep === 2 && currentRecapForm > 1) {
            setCurrentRecapForm(currentRecapForm - 1); // Revient au formulaire récapitulatif précédent
        } else {
            setCurrentStep(1); // Revient au formulaire initial
        }
    };

    // Gestion du champ de saisie de `recapCount`
    const handleRecapCountChange = (e) => {
        const count = Math.max(1, Number(e.target.value));
        setRecapCount(count);
        setRecapForms(Array.from({ length: count }, () => ({
            activite: '',
            montantPresenteTotal: '',
            montantPresenteEligible: '',
            montantSollicite: '',
            piecesJointes: []
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
        const updatedForms = [...recapForms];
        updatedForms[index].piecesJointes = Array.from(files);
        setRecapForms(updatedForms);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">
                    {editData ? 'Modifier Demande de Paiement' : 'Ajouter Demande de Paiement'}
                </h2>

                {currentStep === 1 ? (
                    // Formulaire principal
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Nom du projet</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="SWEDD"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Intitulé de l'opération</label>
                            <input
                                type="text"
                                value={operationTitle}
                                onChange={(e) => setOperationTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Frais de communication"
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
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Affaire suivie par</label>
                            <Select
                                value={followedBy}
                                onChange={setFollowedBy}
                                options={followedByOptions}
                                placeholder="Sélectionner l'affaire suivie"
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Qualité</label>
                            <Select
                                value={quality}
                                onChange={setQuality}
                                options={qualityOptions}
                                placeholder="Sélectionner la qualité"
                                className="w-full"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Suivant
                            </button>
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
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Montant présenté (en coût total)</label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montantPresenteTotal || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montantPresenteTotal', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Montant total"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Montant présenté (en coût total éligible)</label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montantPresenteEligible || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montantPresenteEligible', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Montant éligible"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Montant sollicité (A-B)</label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montantSollicite || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montantSollicite', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Montant sollicité"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Pièces jointes</label>
                            <input
                                type="file"
                                multiple
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
                                    onClick={onClose}
                                    type="button"
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                                >
                                    Terminer
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
