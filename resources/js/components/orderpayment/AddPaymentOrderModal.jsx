import React, { useState } from 'react';

const AddPaymentOrderModal = ({ isVisible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1); // Étape du formulaire
    const [recapCount, setRecapCount] = useState(1); // Nombre de formulaires récapitulatifs souhaités
    const [currentRecapForm, setCurrentRecapForm] = useState(1); // Formulaire récapitulatif en cours
    const [recapForms, setRecapForms] = useState([]); // Données des formulaires récapitulatifs

    if (!isVisible) return null;

    // Gérer le changement de nombre de formulaires récapitulatifs
    const handleRecapCountChange = (e) => {
        const count = Math.max(1, Number(e.target.value)); // Valeur minimale de 1
        setRecapCount(count);
        setRecapForms(Array.from({ length: count }, () => ({
            beneficiaire: '',
            montant: '',
            piecesJointes: [],
            objetDepense: '',
            ligneBudgetaire: ''
        })));
    };

    // Gestion du bouton "Suivant" pour naviguer dans les formulaires récapitulatifs
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-1/3">
                <h2 className="text-2xl font-bold mb-4">ORDRE DE PAIEMENT</h2>

                {currentStep === 1 ? (
                    // Formulaire initial
                    <form>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nom du projet</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Projet 1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">COMPTE</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="ONG GBEWA PIB Projet 1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">INTITULE</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="003712170137"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">N° Facture</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">N° BL</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="106/MOOV/24"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button 
                                onClick={onClose}
                                type="button"
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
                                Annuler
                            </button>
                            <button 
                                type="button"
                                onClick={handleNext}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
                                Suivant
                            </button>
                        </div>
                    </form>
                ) : (
                    // Formulaire récapitulatif
                    <form>
                        {currentRecapForm === 1 && (
                            <div className="mb-4">
                                <label className="block text-gray-700">Nombre de formulaires récapitulatifs</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={recapCount}
                                    onChange={handleRecapCountChange}
                                    className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                    placeholder="Nombre de formulaires récapitulatifs"
                                />
                            </div>
                        )}
                        <h3 className="text-lg font-semibold mb-2">Formulaire Récapitulatif {currentRecapForm} / {recapCount}</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700">Bénéficiaires</label>
                            <input
                                type="text"
                                value={recapForms[currentRecapForm - 1]?.beneficiaire || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'beneficiaire', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Nom du bénéficiaire"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Sommes nettes revenants aux bénéficiaires</label>
                            <input
                                type="number"
                                value={recapForms[currentRecapForm - 1]?.montant || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'montant', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Montant"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Pièces jointes</label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileChange(currentRecapForm - 1, e.target.files)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Objet de la dépense</label>
                            <input
                                type="text"
                                value={recapForms[currentRecapForm - 1]?.objetDepense || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'objetDepense', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Objet de la dépense"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Ligne budgétaire</label>
                            <input
                                type="text"
                                value={recapForms[currentRecapForm - 1]?.ligneBudgetaire || ''}
                                onChange={(e) => handleRecapFormChange(currentRecapForm - 1, 'ligneBudgetaire', e.target.value)}
                                className="border border-gray-300 rounded-lg w-full px-4 py-2"
                                placeholder="Ligne budgétaire"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button 
                                type="button"
                                onClick={handlePrevious}
                                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">
                                Précédent
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
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddPaymentOrderModal;
