// PaymentRequestDetails.jsx
import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaEdit, FaSave } from 'react-icons/fa';
import PaymentRequestForm from './PaymentRequestForm'; // Importer le formulaire
import axios from 'axios';

const PaymentRequestDetails = ({ requestId, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [recapForms, setRecapForms] = useState([]);
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaymentRequest = async () => {
            try {
                const response = await axios.get(`/api/payment-requests/${requestId}`, {
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                console.log('Réponse API pour PaymentRequestDetails:', response.data);
                setPaymentRequest(response.data.data); // Utiliser data.data
                if (response.data.data.recapForms && response.data.data.recapForms.length > 0) {
                    setRecapForms(response.data.data.recapForms);
                } else {
                    setRecapForms([]);
                }
            } catch (err) {
                setError(err);
                console.error('Erreur lors de la récupération des détails de la demande de paiement:', err);
            } finally {
                setLoading(false);
            }
        };

        if (requestId) {
            fetchPaymentRequest();
        }
    }, [requestId]);

    // Fonction pour passer en mode édition
    const handleEditClick = () => {
        setIsEditing(true);
    };

    // Fonction pour fermer le formulaire après édition
    const handleCloseForm = async () => {
        setIsEditing(false);
        setLoading(true);
        try {
            const response = await axios.get(`/api/payment-requests/${requestId}`, {
                headers: {
                    'Accept': 'application/json',
                }
            });
            console.log('Réponse API pour PaymentRequestDetails après édition:', response.data);
            setPaymentRequest(response.data.data); // Utiliser data.data
            if (response.data.data.recapForms && response.data.data.recapForms.length > 0) {
                setRecapForms(response.data.data.recapForms);
            } else {
                setRecapForms([]);
            }
        } catch (err) {
            setError(err);
            console.error('Erreur lors de la récupération des détails de la demande de paiement après édition:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur: {error.message}</p>;
    if (!paymentRequest) return <p>Aucune donnée disponible.</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Affichage du formulaire si en mode édition */}
            {isEditing ? (
                <PaymentRequestForm onClose={handleCloseForm} editData={paymentRequest} />
            ) : (
                <>
                    {/* Bouton de retour avec icône */}
                    <button onClick={onClose} className="text-gray-600 mb-4 hover:text-black flex items-center">
                        <FaChevronLeft size={20} />
                    </button>
                    
                    {/* Titre avec le nom du projet */}
                    <h1 className="text-3xl font-bold mb-6">{paymentRequest.project?.name}</h1>

                    {/* Section d'information - Deux colonnes */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex">
                            <div className="w-1/2">
                                <p><strong>Date et heure :</strong></p>
                                <p><strong>N° d'Ordre :</strong></p>
                                <p><strong>Intitulé de l'opération :</strong></p>
                                <p><strong>Bénéficiaire :</strong></p>
                                <p><strong>Détails de la Facture :</strong></p>
                                <p><strong>Objet/Activité :</strong></p>
                            </div>
                            <div className="w-1/2">
                                <p>{paymentRequest.date ? new Date(paymentRequest.date).toLocaleString() : '-'}</p> {/* Gestion de la date */}
                                <p>{paymentRequest.orderNumber}</p> {/* Utiliser camelCase */}
                                <p>{paymentRequest.operation}</p>
                                <p>{paymentRequest.beneficiary}</p>
                                <p>{paymentRequest.invoiceDetails}</p>
                                <p>{paymentRequest.recapForms && paymentRequest.recapForms.length > 0 ? paymentRequest.recapForms[0].activite : paymentRequest.budgetLine}</p> {/* Ajustement selon les données */}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2">
                                <p><strong>Affaire suivie par :</strong></p>
                                <p><strong>Qualité :</strong></p>
                                <p><strong>Mail :</strong></p>
                            </div>
                            <div className="w-1/2">
                                <p>{paymentRequest.followedBy?.name || '-'}</p>
                                <p>{paymentRequest.quality || '-'}</p>
                                <p>{paymentRequest.followedBy?.email || '-'}</p> {/* Accès correct à l'email */}
                            </div>
                        </div>
                    </div>

                    {/* Tableau des montants récapitulatifs */}
                    <h3 className="text-lg font-semibold mb-2">Formulaires Récapitulatif</h3>
                    <table className="min-w-full bg-white rounded-lg shadow-lg border border-gray-300 mb-6">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">N°</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Activité</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Montant présenté (A)</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Montant éligible (B)</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Montant sollicité (A-B)</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Pièces Jointes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recapForms.length > 0 ? (
                                recapForms.map((form, index) => (
                                    <tr key={form.id || index} className="text-center border-t border-gray-300 hover:bg-gray-50">
                                        <td className="py-2 px-4 border border-gray-300">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="py-2 px-4 border border-gray-300">{form.activite}</td>
                                        <td className="py-2 px-4 border border-gray-300">{Number(form.montantPresenteTotal).toLocaleString('fr-FR')} FCFA</td> {/* Utiliser camelCase */}
                                        <td className="py-2 px-4 border border-gray-300">{Number(form.montantPresenteEligible).toLocaleString('fr-FR')} FCFA</td> {/* Utiliser camelCase */}
                                        <td className="py-2 px-4 border border-gray-300">{Number(form.montantSollicite).toLocaleString('fr-FR')} FCFA</td> {/* Utiliser camelCase */}
                                        <td className="py-2 px-4 border border-gray-300">
                                            {form.attachments && form.attachments.length > 0 ? (
                                                <ul className="list-disc list-inside">
                                                    {form.attachments.map((file) => (
                                                        <li key={file.id}>
                                                            <a
                                                                href={file.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-500 hover:underline"
                                                            >
                                                                {file.fileName} {/* Utiliser camelCase */}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                                        Aucun formulaire récapitulatif disponible.
                                    </td>
                                </tr>
                            )}
                            {/* Ligne de total */}
                            {recapForms.length > 0 && (
                                <tr className="text-center border-t border-gray-300 hover:bg-gray-50 font-bold">
                                    <td className="py-2 px-4 border border-gray-300" colSpan="2">TOTAL DEMANDE</td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {recapForms.reduce((acc, form) => acc + Number(form.montantPresenteTotal || 0), 0).toLocaleString('fr-FR')} FCFA
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {recapForms.reduce((acc, form) => acc + Number(form.montantPresenteEligible || 0), 0).toLocaleString('fr-FR')} FCFA
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {recapForms.reduce((acc, form) => acc + Number(form.montantSollicite || 0), 0).toLocaleString('fr-FR')} FCFA
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300"></td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Texte final */}
                    <p className="mt-4 text-gray-600">
                        Arrêté la présente demande de paiement à la somme totale de{' '}
                        {recapForms.reduce((acc, form) => acc + Number(form.montantSollicite || 0), 0).toLocaleString('fr-FR')} FCFA.
                        Je certifie exactes les informations mentionnées dans la présente demande de paiement.
                    </p>

                    {/* Informations supplémentaires et boutons */}
                    <div className="mt-6">
                        <p className="text-gray-600 mb-2">Le chargé de Logistique</p>
                        <p className="text-gray-600">{paymentRequest.followedBy?.name || '-'}</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={handleEditClick}
                                className="border border-green-600 text-green-600 hover:bg-green-100 py-2 px-4 rounded-lg flex items-center"
                            >
                                <FaEdit className="mr-2" /> Modifier
                            </button>
                            <button
                                type="button"
                                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center"
                            >
                                <FaSave className="mr-2" /> Enregistrer
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

};

export default PaymentRequestDetails;
