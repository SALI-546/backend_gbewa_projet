import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetTrackingForm = ({ onClose, engagementId, existingData }) => {
    const [formData, setFormData] = useState({
        budget_line: '',
        amount_allocated: '',
        amount_spent: '',
        amount_approved: '',
        old_balance: '',
        new_balance: '',
        fournisseurs_prestataire: '',
        avis: '',
        moyens_de_paiement: '',
        signature: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingData) {
            setFormData({
                budget_line: existingData.budget_line || '',
                amount_allocated: existingData.amount_allocated || '',
                amount_spent: existingData.amount_spent || '',
                amount_approved: existingData.amount_approved || '',
                old_balance: existingData.old_balance || '',
                new_balance: existingData.new_balance || '',
                fournisseurs_prestataire: existingData.fournisseurs_prestataire || '',
                avis: existingData.avis || '',
                moyens_de_paiement: existingData.moyens_de_paiement || '',
                signature: existingData.signature || '',
            });
        }
    }, [existingData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            amount_allocated: parseFloat(formData.amount_allocated) || 0,
            amount_spent: parseFloat(formData.amount_spent) || 0,
            amount_approved: parseFloat(formData.amount_approved) || 0,
            old_balance: parseFloat(formData.old_balance) || 0,
            new_balance: parseFloat(formData.new_balance) || 0,
        };

        try {
            if (existingData && existingData.id) {
                // Mettre à jour le suivi budgétaire existant
                await axios.put(`/api/budget-trackings/${existingData.id}`, payload);
            } else {
                // Créer un nouveau suivi budgétaire
                await axios.post(`/api/engagements/${engagementId}/budget-tracking`, payload);
            }
            alert('Suivi budgétaire enregistré avec succès.');
            onClose();
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement du suivi budgétaire:', err);
            alert('Erreur lors de l\'enregistrement du suivi budgétaire : ' + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div
                className="bg-white rounded-lg p-6 w-full max-w-sm sm:max-w-md md:max-w-2xl max-h-[80vh] overflow-y-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{existingData ? 'Modifier Suivi Budgétaire' : 'Créer Suivi Budgétaire'}</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black focus:outline-none text-2xl">
                        &times;
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Ligne budgétaire */}
                    <div>
                        <label className="block font-medium mb-1">Ligne budgétaire</label>
                        <input
                            type="text"
                            name="budget_line"
                            value={formData.budget_line}
                            onChange={handleChange}
                            placeholder="Ligne budgétaire"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Montant inscrit au budget */}
                    <div>
                        <label className="block font-medium mb-1">Montant inscrit au budget</label>
                        <input
                            type="number"
                            name="amount_allocated"
                            value={formData.amount_allocated}
                            onChange={handleChange}
                            placeholder="Montant inscrit au budget"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Montant déjà dépensé */}
                    <div>
                        <label className="block font-medium mb-1">Montant déjà dépensé</label>
                        <input
                            type="number"
                            name="amount_spent"
                            value={formData.amount_spent}
                            onChange={handleChange}
                            placeholder="Montant déjà dépensé"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Montant accordé */}
                    <div>
                        <label className="block font-medium mb-1">Montant accordé</label>
                        <input
                            type="number"
                            name="amount_approved"
                            value={formData.amount_approved}
                            onChange={handleChange}
                            placeholder="Montant accordé"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Ancien solde */}
                    <div>
                        <label className="block font-medium mb-1">Ancien solde</label>
                        <input
                            type="number"
                            name="old_balance"
                            value={formData.old_balance}
                            onChange={handleChange}
                            placeholder="Ancien solde"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Nouveau solde */}
                    <div>
                        <label className="block font-medium mb-1">Nouveau solde</label>
                        <input
                            type="number"
                            name="new_balance"
                            value={formData.new_balance}
                            onChange={handleChange}
                            placeholder="Nouveau solde"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Fournisseurs / Prestataire */}
                    <div>
                        <label className="block font-medium mb-1">Fournisseurs / Prestataire</label>
                        <input
                            type="text"
                            name="fournisseurs_prestataire"
                            value={formData.fournisseurs_prestataire}
                            onChange={handleChange}
                            placeholder="Fournisseurs / Prestataire"
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />
                    </div>

                    {/* Section Avis */}
                    <div className="space-y-2 mt-4">
                        <label className="block font-medium mb-1">Avis</label>
                        <div className="flex flex-col sm:flex-row sm:space-x-4">
                            <label className="flex items-center space-x-2 mb-2 sm:mb-0">
                                <input
                                    type="radio"
                                    name="avis"
                                    value="Favorable"
                                    checked={formData.avis === 'Favorable'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Favorable</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="avis"
                                    value="Défavorable"
                                    checked={formData.avis === 'Défavorable'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Défavorable</span>
                            </label>
                        </div>
                    </div>

                    {/* Section Moyens de paiement */}
                    <div className="space-y-2 mt-4">
                        <label className="block font-medium mb-1">Moyens de paiement</label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="moyens_de_paiement"
                                    value="Caisse"
                                    checked={formData.moyens_de_paiement === 'Caisse'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Caisse</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="moyens_de_paiement"
                                    value="Chèque"
                                    checked={formData.moyens_de_paiement === 'Chèque'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Chèque</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="moyens_de_paiement"
                                    value="Virement"
                                    checked={formData.moyens_de_paiement === 'Virement'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Virement</span>
                            </label>
                        </div>
                    </div>

                    {/* Section Signature */}
                    <div className="space-y-2 mt-4">
                        <label className="block font-medium mb-1">Signature</label>
                        <div className="flex flex-wrap gap-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="signature"
                                    value="Visa Comptable"
                                    checked={formData.signature === 'Visa Comptable'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Visa Comptable</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="signature"
                                    value="Visa Chef Comptable"
                                    checked={formData.signature === 'Visa Chef Comptable'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Visa Chef Comptable</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="signature"
                                    value="Visa DAF"
                                    checked={formData.signature === 'Visa DAF'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Visa DAF</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="signature"
                                    value="Visa DE"
                                    checked={formData.signature === 'Visa DE'}
                                    onChange={handleChange}
                                    className="form-radio text-green-500"
                                />
                                <span>Visa DE</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`bg-green-600 text-white py-2 px-4 rounded-lg w-full mt-6 hover:bg-green-700 transition-colors duration-200 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isSubmitting}
                    >
                        {existingData ? 'Mettre à Jour' : 'Enregistrer'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BudgetTrackingForm;
