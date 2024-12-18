// PaymentOrderDetails.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';

const PaymentOrderDetails = ({ isVisible, order, onClose }) => {
    if (!isVisible || !order) return null;

    useEffect(() => {
        console.log('Détails de l\'ordre dans PaymentOrderDetails:', order);
    }, [order]);

    // Définir les rôles de signature disponibles
    const signatureRoles = [
        {
            role: 'emetteur',
            title: 'EMETTEUR',
            position: 'Le chargé de logistique',
            name: 'SINSIN Daniel',
        },
        {
            role: 'controle',
            title: 'CONTROLE',
            position: 'Le DAF',
            name: 'GNONHOSSOU Brice',
        },
        {
            role: 'validation',
            title: 'VALIDATION',
            position: 'Le Directeur Exécutif',
            name: 'AHOLOU G. Minhoumon',
        },
        {
            role: 'visa_comptable',
            title: 'VISA COMPTABLE',
            position: 'Le Comptable',
            name: 'Nom du Comptable',
        },
        {
            role: 'visa_chef_comptable',
            title: 'VISA CHEF COMPTABLE',
            position: 'Le Chef Comptable',
            name: 'Nom du Chef Comptable',
        },
        {
            role: 'visa_daf',
            title: 'VISA DAF',
            position: 'Le DAF',
            name: 'Nom du DAF',
        },
        {
            role: 'visa_de',
            title: 'VISA DE',
            position: 'Le Directeur Exécutif',
            name: 'Nom du Directeur Exécutif',
        },
    ];

    // État pour les signatures existantes
    const [existingSignatures, setExistingSignatures] = useState({});

    // Références pour les pads de signature
    const signaturePads = {};

    signatureRoles.forEach((signature) => {
        signaturePads[signature.role] = useRef(null);
    });

    // Charger les signatures existantes
    useEffect(() => {
        if (order.signatures) {
            const signatures = {};
            order.signatures.forEach((sig) => {
                signatures[sig.role] = sig;
            });
            setExistingSignatures(signatures);
        }
    }, [order]);

    // Fonction pour sauvegarder une signature
    const handleSaveSignature = async (role) => {
        const pad = signaturePads[role].current;
        if (pad.isEmpty()) {
            alert('Veuillez signer avant de sauvegarder.');
            return;
        }

        const signatureData = pad.getTrimmedCanvas().toDataURL('image/png');

        // Trouver le rôle correspondant
        const roleData = signatureRoles.find((s) => s.role === role);
        if (!roleData) {
            alert('Rôle de signature invalide.');
            return;
        }

        try {
            const response = await axios.post(`/api/payment-orders/${order.id}/signatures`, {
                role: roleData.role,
                name: roleData.name,
                signature: signatureData,
            });

            // Mettre à jour les signatures existantes
            setExistingSignatures((prev) => ({
                ...prev,
                [role]: {
                    id: response.data.data.id,
                    role: response.data.data.role,
                    name: response.data.data.name,
                    signatureUrl: response.data.data.signature_url,
                    signedAt: response.data.data.signed_at,
                },
            }));

            // Effacer le pad de signature
            pad.clear();

            alert('Signature enregistrée avec succès.');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la signature :', error);
            alert('Erreur lors de l\'enregistrement de la signature.');
        }
    };

    // Fonction pour effacer une signature
    const handleClearSignature = (role) => {
        const pad = signaturePads[role].current;
        if (pad) {
            pad.clear();
        }
    };

    const recapForms = Array.isArray(order.recapForms) ? order.recapForms : [];

    // Calcul des totaux
    const totalDemande = recapForms.reduce((acc, form) => acc + Number(form.montant || 0), 0);
    const totalRappel = recapForms.reduce((acc, form) => acc + Number(form.montant || 0), 0);
    const totalGeneral = totalDemande;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-5xl overflow-auto max-h-screen">
                <div className="flex justify-between items-center mb-4">
                    {/* Bouton retour */}
                    <button onClick={onClose} className="flex items-center text-gray-600 hover:text-black">
                        <FaChevronLeft size={20} />
                        <span className="ml-2 font-bold text-2xl">SWEDD</span>
                    </button>
                </div>
                {/* Détails de l'ordre */}
                <div className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p><strong>Date et heure:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>N° d'Ordre:</strong> {order.orderNumber}</p>
                            <p><strong>COMPTE:</strong> {order.account}</p>
                            <p><strong>INTITULE:</strong> {order.title}</p>
                        </div>
                        <div>
                            <p><strong>N° Facture:</strong> {order.invoiceNumber}</p>
                            <p><strong>N° BL:</strong> {order.billOfLadingNumber}</p>
                        </div>
                    </div>
                </div>

                {/* Tableau détaillé des formulaires récapitulatifs */}
                <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-6">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">N°</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Bénéficiaires</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Sommes nettes revenant aux bénéficiaires</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Objet de la dépense</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Ligne budgétaire</th>
                            <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Pièces Jointes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recapForms.length > 0 ? (
                            recapForms.map((form, index) => (
                                <tr key={form.id || index} className="text-center border-t border-gray-300 hover:bg-gray-50">
                                    <td className="py-2 px-4 border border-gray-300">{(index + 1).toString().padStart(2, '0')}</td>
                                    <td className="py-2 px-4 border border-gray-300">{form.beneficiaire}</td>
                                    <td className="py-2 px-4 border border-gray-300">{Number(form.montant).toLocaleString()} FCFA</td>
                                    <td className="py-2 px-4 border border-gray-300">{form.objetDepense}</td>
                                    <td className="py-2 px-4 border border-gray-300">{form.ligneBudgetaire}</td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {form.piecesJointes && form.piecesJointes.length > 0 ? (
                                            form.piecesJointes.map((piece, idx) => (
                                                <a 
                                                    href={piece.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    key={idx} 
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    {piece.fileName}{idx < form.piecesJointes.length - 1 ? ', ' : ''}
                                                </a>
                                            ))
                                        ) : (
                                            'Aucune pièce jointe'
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="text-center border-t border-gray-300">
                                <td colSpan="6" className="py-4 px-4 text-gray-500">Aucun formulaire récapitulatif trouvé.</td>
                            </tr>
                        )}

                        {/* Totaux */}
                        <tr className="text-center font-bold">
                            <td colSpan="2" className="py-2 px-4 text-left">TOTAL DEMANDE:</td>
                            <td className="py-2 px-4 border border-gray-300">{totalDemande.toLocaleString()} FCFA</td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                        </tr>
                        <tr className="text-center font-bold">
                            <td colSpan="2" className="py-2 px-4 text-left">RAPPEL DES ORDRES ANTÉRIEURS:</td>
                            <td className="py-2 px-4 border border-gray-300">{totalRappel.toLocaleString()} FCFA</td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                        </tr>
                        <tr className="text-center font-bold">
                            <td colSpan="2" className="py-2 px-4 text-left">TOTAL GÉNÉRAL:</td>
                            <td className="py-2 px-4 border border-gray-300">{totalGeneral.toLocaleString()} FCFA</td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                        </tr>
                    </tbody>
                </table>

                {/* Note de bas de page */}
                <p className="mt-6 text-center">
                    Arrêté le présent état des ordres de paiement à la somme totale de {totalGeneral.toLocaleString()} francs CFA.
                </p>

                {/* Table des Signatures */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Signatures</h2>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Rôle</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Nom</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Signature</th>
                                <th className="py-2 px-4 bg-gray-100 text-center font-medium text-gray-600 border border-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {signatureRoles.map((signatureRole) => {
                                const existingSignature = existingSignatures[signatureRole.role];
                                return (
                                    <tr key={signatureRole.role} className="text-center border-t border-gray-300 hover:bg-gray-50">
                                        <td className="py-2 px-4 border border-gray-300">{signatureRole.title}</td>
                                        <td className="py-2 px-4 border border-gray-300">{signatureRole.name}</td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            {existingSignature ? (
                                                <div className="flex flex-col items-center">
                                                    <img 
                                                        src={existingSignature.signatureUrl} 
                                                        alt={`${signatureRole.role} signature`} 
                                                        className="w-40 h-20 border"
                                                    />
                                                    <p className="mt-2">{`Signé le : ${new Date(existingSignature.signedAt).toLocaleDateString()}`}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <SignatureCanvas 
                                                        ref={signaturePads[signatureRole.role]}
                                                        penColor="black"
                                                        canvasProps={{ width: 300, height: 100, className: 'signature-canvas border rounded' }}
                                                    />
                                                    <div className="mt-2 flex space-x-2">
                                                        <button
                                                            onClick={() => handleSaveSignature(signatureRole.role)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                                                        >
                                                            Sauvegarder
                                                        </button>
                                                        <button
                                                            onClick={() => handleClearSignature(signatureRole.role)}
                                                            className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
                                                        >
                                                            Effacer
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border border-gray-300">
                                            {existingSignature && (
                                                <button
                                                    onClick={() => window.open(existingSignature.signatureUrl, '_blank')}
                                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                                                >
                                                    Voir
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    ); 
}

export default PaymentOrderDetails;
