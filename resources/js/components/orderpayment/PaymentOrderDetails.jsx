// PaymentOrderDetails.jsx

import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa'; 

const PaymentOrderDetails = ({ isVisible, order, onClose }) => {
    if (!isVisible || !order) return null;

    useEffect(() => {
        console.log('Détails de l\'ordre dans PaymentOrderDetails:', order);
    }, [order]);

    // État pour les signatures
    const [signatures, setSignatures] = useState({
        emetteur: { signed: false, date: '' },
        controle: { signed: false, date: '' },
        validation: { signed: false, date: '' },
    });

    // Fonction pour gérer le changement de signature
    const handleSignatureChange = (role) => {
        setSignatures((prevSignatures) => ({
            ...prevSignatures,
            [role]: {
                ...prevSignatures[role],
                signed: !prevSignatures[role].signed,
                date: !prevSignatures[role].signed ? new Date().toISOString().slice(0, 10) : '',
            },
        }));
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
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
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
                            <td colSpan="2" className="py-2 px-4 text-left">RAPPEL DES ORDRES ANTERIEURS:</td>
                            <td className="py-2 px-4 border border-gray-300">{totalRappel.toLocaleString()} FCFA</td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                            <td className="py-2 px-4"></td>
                        </tr>
                        <tr className="text-center font-bold">
                            <td colSpan="2" className="py-2 px-4 text-left">TOTAL GENERAL:</td>
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

                {/* Signatures */}
                <div className="mt-8 grid grid-cols-3 text-center">
                    {/* EMETTEUR */}
                    <div>
                        <p className="font-bold">EMETTEUR (signature et date)</p>
                        <div className="flex flex-col items-center">
                            {/* Input pour la signature */}
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={signatures.emetteur.signed}
                                    onChange={() => handleSignatureChange('emetteur')}
                                />
                                <span>Signer</span>
                            </label>
                            {/* Affichage de la date si signé */}
                            {signatures.emetteur.signed && (
                                <p className="mt-2">{`Signé le : ${signatures.emetteur.date}`}</p>
                            )}
                            <p>Le chargé de logistique</p>
                            <p>SINSIN Daniel</p>
                        </div>
                    </div>
                    {/* CONTROLE */}
                    <div>
                        <p className="font-bold">CONTROLE (signature et date)</p>
                        <div className="flex flex-col items-center">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={signatures.controle.signed}
                                    onChange={() => handleSignatureChange('controle')}
                                />
                                <span>Signer</span>
                            </label>
                            {signatures.controle.signed && (
                                <p className="mt-2">{`Signé le : ${signatures.controle.date}`}</p>
                            )}
                            <p>Le DAF</p>
                            <p>GNONHOSSOU Brice</p>
                        </div>
                    </div>
                    {/* VALIDATION */}
                    <div>
                        <p className="font-bold">VALIDATION (signature et date)</p>
                        <div className="flex flex-col items-center">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={signatures.validation.signed}
                                    onChange={() => handleSignatureChange('validation')}
                                />
                                <span>Signer</span>
                            </label>
                            {signatures.validation.signed && (
                                <p className="mt-2">{`Signé le : ${signatures.validation.date}`}</p>
                            )}
                            <p>Le Directeur Exécutif</p>
                            <p>AHOLOU G. Minhoumon</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    ); 
}
export default PaymentOrderDetails;