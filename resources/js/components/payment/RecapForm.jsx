// RecapForm.jsx

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const RecapForm = ({ form, index, onUpdate, onDelete }) => {
    const [activite, setActivite] = useState(form.activite || '');
    const [montantPresenteTotal, setMontantPresenteTotal] = useState(form.montantPresenteTotal || '');
    const [montantPresenteEligible, setMontantPresenteEligible] = useState(form.montantPresenteEligible || '');
    const [montantSollicite, setMontantSollicite] = useState(form.montantSollicite || '');
    const [existingAttachments, setExistingAttachments] = useState(form.existingAttachments || []);
    const [newAttachment, setNewAttachment] = useState(null); // Pour une seule pièce jointe
    const [attachmentBase64, setAttachmentBase64] = useState(''); // Encodage Base64
    const [deletedAttachments, setDeletedAttachments] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        setActivite(form.activite || '');
        setMontantPresenteTotal(form.montantPresenteTotal || '');
        setMontantPresenteEligible(form.montantPresenteEligible || '');
        setMontantSollicite(form.montantSollicite || '');
        setExistingAttachments(form.existingAttachments || []);
        setAttachmentBase64(form.attachmentBase64 || '');
        setDeletedAttachments(form.deletedAttachments || []);
        // Réinitialiser newAttachment si le formulaire est en mode mise à jour
        if (form.id) {
            setNewAttachment(null);
        }
    }, [form]);

    // Fonction pour gérer la sélection du fichier
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Retirer le préfixe "data:*/*;base64,"
                setAttachmentBase64(base64String);
                setNewAttachment({
                    fileName: file.name,
                    fileType: file.type,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Fonction pour supprimer une pièce jointe existante
    const handleDeleteExistingAttachment = (attachmentId) => {
        setDeletedAttachments([...deletedAttachments, attachmentId]);
        setExistingAttachments(existingAttachments.filter(att => att.id !== attachmentId));
        onDelete(attachmentId); // Informer le parent de la suppression
    };

    // Fonctions pour fermer les alertes
    const closeSuccessAlert = () => {
        setSuccessMessage(null);
    };

    const closeErrorAlert = () => {
        setErrorMessage(null);
    };

    // Fonction pour gérer la soumission du formulaire récapitulatif
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const recapFormData = {
                activite: activite,
                montant_presente_total: montantPresenteTotal,
                montant_presente_eligible: montantPresenteEligible,
                montant_sollicite: montantSollicite,
                deleted_attachments: deletedAttachments,
                attachment_base64: attachmentBase64, // Inclure l'encodage Base64
                attachment_file_name: newAttachment ? newAttachment.fileName : null,
                attachment_file_type: newAttachment ? newAttachment.fileType : null,
            };

            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            };

            let response;
            if (form.id) {
                // Mettre à jour un formulaire récapitulatif existant
                response = await axios.patch(`/api/recap-forms/${form.id}`, recapFormData, config);
                setSuccessMessage('Formulaire récapitulatif mis à jour avec succès.');
                onUpdate(index, {
                    ...form,
                    activite,
                    montantPresenteTotal,
                    montantPresenteEligible,
                    montantSollicite,
                    existingAttachments: response.data.data.attachments || existingAttachments,
                });
            } else {
                // Créer un nouveau formulaire récapitulatif
                recapFormData.payment_request_id = form.payment_request_id;
                response = await axios.post('/api/recap-forms', recapFormData, config);
                setSuccessMessage('Formulaire récapitulatif soumis avec succès.');
                onUpdate(index, {
                    id: response.data.data.id,
                    activite: activite,
                    montantPresenteTotal: montantPresenteTotal,
                    montantPresenteEligible: montantPresenteEligible,
                    montantSollicite: montantSollicite,
                    payment_request_id: form.payment_request_id,
                    existingAttachments: response.data.data.attachments || [],
                });
            }
        } catch (error) {
            console.error('Erreur lors de la soumission du formulaire récapitulatif:', error);
            if (error.response && error.response.data && error.response.data.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                setErrorMessage('Erreur lors de la soumission du formulaire récapitulatif:\n' + errorMessages);
            } else {
                setErrorMessage('Erreur lors de la soumission du formulaire récapitulatif.');
            }
        } finally {
            setIsUpdating(false);
            setAttachmentBase64('');
            setNewAttachment(null);
        }
    };

    return (
        <div className={`border border-gray-300 p-3 rounded mb-3 relative`}>
            <button
                type="button"
                onClick={() => onDelete(form.id)}
                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
            >
                <FaTimes />
            </button>
            <h4 className="text-md font-medium mb-1">Formulaire {index + 1}</h4>
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{successMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <button onClick={closeSuccessAlert}>
                            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Fermer</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                            </svg>
                        </button>
                    </span>
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">{errorMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <button onClick={closeErrorAlert}>
                            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Fermer</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                            </svg>
                        </button>
                    </span>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* Champs existants */}
                <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-0.5">Activité</label>
                    <input
                        type="text"
                        value={activite}
                        onChange={(e) => setActivite(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                        placeholder="Description de l'activité"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-0.5">Montant présenté (en coût total)</label>
                    <input
                        type="number"
                        value={montantPresenteTotal}
                        onChange={(e) => setMontantPresenteTotal(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                        placeholder="Montant total"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-0.5">Montant présenté (en coût total éligible)</label>
                    <input
                        type="number"
                        value={montantPresenteEligible}
                        onChange={(e) => setMontantPresenteEligible(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                        placeholder="Montant éligible"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-0.5">Montant sollicité (A-B)</label>
                    <input
                        type="number"
                        value={montantSollicite}
                        onChange={(e) => setMontantSollicite(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5"
                        placeholder="Montant sollicité"
                        required
                    />
                </div>

                {/* Champ pour Ajouter une Pièce Jointe */}
                <div className="mb-2">
                    <label className="block text-gray-700 font-medium mb-0.5">Ajouter une Pièce Jointe</label>
                    <input
                        type="file"
                        accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 mt-1"
                    />
                    {/* Afficher la Pièce Jointe Sélectionnée */}
                    {newAttachment && (
                        <div className="mt-2">
                            <p className="text-gray-700">Fichier sélectionné: {newAttachment.fileName}</p>
                        </div>
                    )}
                </div>

                {/* Affichage des Pièces Jointes Existantes */}
                {existingAttachments.length > 0 && (
                    <div className="mb-2">
                        <label className="block text-gray-700 font-medium mb-0.5">Pièces Jointes Existantes</label>
                        <ul className="mt-1 list-disc list-inside">
                            {existingAttachments.map(att => (
                                <li key={att.id} className="flex items-center justify-between">
                                    <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {att.fileName}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingAttachment(att.id)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded"
                    disabled={isUpdating}
                >
                    {form.id ? 'Mettre à jour' : 'Ajouter'}
                </button>
            </form>
        </div>
    );

};

export default RecapForm;
