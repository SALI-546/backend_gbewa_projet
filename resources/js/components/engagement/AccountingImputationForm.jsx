// AccountingImputationForm.jsx

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

const AccountingImputationForm = ({ onClose, engagementId, existingData }) => {
    const [orderNumber, setOrderNumber] = useState('');
    const [description, setDescription] = useState('');
    const [entries, setEntries] = useState([]);
    const [accountType, setAccountType] = useState('Débit');
    const [accountNumber, setAccountNumber] = useState('');
    const [amountType, setAmountType] = useState('Débit');
    const [amountPlaceholder, setAmountPlaceholder] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingData) {
            setOrderNumber(existingData.order_number || '');
            setDescription(existingData.description || '');
            
            // Convertir les entrées du backend (snake_case) en camelCase
            const mappedEntries = (existingData.entries || []).map(e => ({
                // ID conservé tel quel
                id: e.id,
                // Conversion des noms de champs
                accountType: e.account_type, 
                accountNumber: e.account_number,
                amountType: e.amount_type,
                amountPlaceholder: e.amount_placeholder,
            }));
            
            setEntries(mappedEntries);
        }
    }, [existingData]);
    

    const addEntry = () => {
        if (accountNumber && amountPlaceholder) {
            setEntries([
                ...entries,
                {
                    id: null, // Entrée nouvelle n'a pas d'ID
                    accountType,
                    accountNumber,
                    amountType,
                    amountPlaceholder,
                },
            ]);
            setAccountNumber('');
            setAmountPlaceholder('');
        } else {
            alert('Veuillez remplir les champs "Numéro de compte" et "Montant".');
        }
    };

    const handleEditEntry = (index) => {
        const entry = entries[index];
        setAccountType(entry.accountType);
        setAccountNumber(entry.accountNumber);
        setAmountType(entry.amountType);
        setAmountPlaceholder(entry.amountPlaceholder);
        // Supprimer l'entrée en cours d'édition
        setEntries(entries.filter((_, i) => i !== index));
    };

    const handleDeleteEntry = (index) => {
        setEntries(entries.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            order_number: orderNumber,
            description,
            entries: entries.map(({ id, accountType, accountNumber, amountType, amountPlaceholder }) => ({
                id, // Inclure l'ID si présent
                accountType,
                accountNumber,
                amountType,
                amountPlaceholder,
            })),
        };

        try {
            if (existingData && existingData.id) {
                // Mise à jour de l'imputation comptable existante
                await axios.put(`/api/accounting-imputations/${existingData.id}`, payload);
            } else {
                // Création d'une nouvelle imputation comptable
                await axios.post(`/api/engagements/${engagementId}/accounting-imputation`, payload);
            }
            alert('Imputation comptable enregistrée avec succès.');
            onClose();
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de l\'imputation comptable:', error);
            if (error.response && error.response.data) {
                console.log('Erreurs de validation:', error.response.data);
                alert('Erreur lors de l\'enregistrement : ' + JSON.stringify(error.response.data));
            } else {
                alert('Une erreur inattendue est survenue.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">
                        {existingData ? 'Modifier Imputation Comptable' : 'Créer Imputation Comptable'}
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black text-2xl focus:outline-none">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Numéro d'ordre */}
                        <div>
                            <label className="block font-medium text-gray-700">Numéro d'ordre<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Numéro d'ordre"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-medium text-gray-700">Description</label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="Description"
                            />
                        </div>

                        {/* Lignes Ajoutées */}
                        <div>
                            <label className="block font-medium text-gray-700">Lignes Ajoutées</label>
                            <div className="space-y-1 text-sm border-b pb-2">
                                <div className="flex justify-between items-center font-semibold text-gray-500">
                                    <span className="w-8">ID</span>
                                    <span className="w-20">Type</span>
                                    <span className="w-32">Numéro</span>
                                    <span className="w-20 text-right">Montant</span>
                                    <span className="w-8"></span>
                                </div>
                                {entries.map((entry, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="w-8 text-gray-600">{entry.id ? entry.id : index + 1}</span>
                                        <span className="w-20 text-gray-800">{entry.accountType}</span>
                                        <span className="w-32 truncate text-gray-800">{entry.accountNumber}</span>
                                        <span className="w-20 text-gray-800 text-right">{entry.amountPlaceholder}</span>
                                        <div className="w-8 flex space-x-1">
                                            <button
                                                type="button"
                                                onClick={() => handleEditEntry(index)}
                                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteEntry(index)}
                                                className="text-red-500 hover:text-red-700 focus:outline-none"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Section pour ajouter une nouvelle ligne */}
                        <div className="space-y-4 mt-4">
                            <label className="block font-medium text-gray-700">Ajouter une ligne</label>

                            {/* Type de compte */}
                            <div>
                                <p className="font-medium text-gray-700">Type de compte<span className="text-red-500">*</span></p>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            checked={accountType === 'Débit'}
                                            onChange={() => setAccountType('Débit')}
                                            className="form-radio text-green-600 focus:ring-green-600 checked:bg-green-600"
                                            required
                                        />
                                        <span>Débit</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            checked={accountType === 'Crédit'}
                                            onChange={() => setAccountType('Crédit')}
                                            className="form-radio text-green-600 focus:ring-green-600 checked:bg-green-600"
                                            required
                                        />
                                        <span>Crédit</span>
                                    </label>
                                </div>
                            </div>

                            {/* Numéro de compte */}
                            <div>
                                <label className="block font-medium text-gray-700">Numéro de compte<span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Numéro de compte"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Montant */}
                            <div>
                                <p className="font-medium text-gray-700">Montant<span className="text-red-500">*</span></p>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="amountType"
                                            checked={amountType === 'Débit'}
                                            onChange={() => setAmountType('Débit')}
                                            className="form-radio text-green-600 focus:ring-green-600 checked:bg-green-600"
                                            required
                                        />
                                        <span>Débit</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="amountType"
                                            checked={amountType === 'Crédit'}
                                            onChange={() => setAmountType('Crédit')}
                                            className="form-radio text-green-600 focus:ring-green-600 checked:bg-green-600"
                                            required
                                        />
                                        <span>Crédit</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Montant"
                                    value={amountPlaceholder}
                                    onChange={(e) => setAmountPlaceholder(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={addEntry}
                                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none"
                                >
                                    Ajouter la ligne
                                </button>
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none ${
                                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        {existingData ? 'Mettre à Jour' : 'Enregistrer'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountingImputationForm;
