// PaymentOrderDetails.jsx

import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa'; // Icône pour retour

const PaymentOrderDetails = ({ isVisible, order, onClose }) => {
    if (!isVisible || !order) return null;

    // État pour les signatures
    const [signatures, setSignatures] = useState({
        emetteur: { signed: false, date: '' },
        controle: { signed: false, date: '' },
        validation: { signed: false, date: '' },
    });

    // Fonction pour gérer le changement de signature
    const handleSignatureChange = (role) => {
        setSignatures({
            ...signatures,
            [role]: {
                ...signatures[role],
                signed: !signatures[role].signed,
                date: !signatures[role].signed ? new Date().toISOString().slice(0, 10) : '',
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-4/5 max-w-5xl">
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
                            <p><strong>Date et heure:</strong> 09/10/2024 00:00</p>
                            <p><strong>N° d'Ordre:</strong> {order.orderNumber}</p>
                            <p><strong>COMPTE:</strong> ONG GBEWA PIB SWEDD</p>
                            <p><strong>INTITULE:</strong> 003712170137</p>
                        </div>
                        <div>
                            <p><strong>N° Facture:</strong> EM100234-23 du 12/10/2024</p>
                            <p><strong>N° BL:</strong> 106/MOOV/24</p>
                        </div>
                    </div>
                </div>

                {/* Tableau détaillé */}
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
                        <tr className="text-center border-t border-gray-300">
                            <td className="py-2 px-4 border border-gray-300">01</td>
                            <td className="py-2 px-4 border border-gray-300">Facture EM100234-23 du 12/10/2024</td>
                            <td className="py-2 px-4 border border-gray-300">250 000</td>
                            <td className="py-2 px-4 border border-gray-300">Dotation en communication staff projet, Octobre 2024</td>
                            <td className="py-2 px-4 border border-gray-300">250 000</td>
                            <td className="py-2 px-4 border border-gray-300">Bon de commande, Facture</td>
                        </tr>
                        {/* Lignes vides pour la mise en page */}
                        <tr className="text-center border-t border-gray-300">
                            <td className="py-2 px-4 border border-gray-300">02</td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                        </tr>
                        <tr className="text-center border-t border-gray-300">
                            <td className="py-2 px-4 border border-gray-300">03</td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                        </tr>
                        <tr className="text-center border-t border-gray-300">
                            <td className="py-2 px-4 border border-gray-300">04</td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                            <td className="py-2 px-4 border border-gray-300"></td>
                        </tr>
                        {/* Lignes pour les Totaux uniquement sous "Sommes nettes revenant aux bénéficiaires" */}
                        <tr className="text-center font-bold">
                            <td colSpan="2" className="py-2 px-4 text-left border-none">TOTAL DEMANDE:</td>
                            <td className="py-2 px-4 border border-gray-300 border-l-2 border-r-2">415 360 FCFA</td>
                            <td className="py-2 px-4 border-none"></td>
                            <td className="py-2 px-4 border-none"></td>
                            <td className="py-2 px-4 border-none"></td>
                        </tr>
                        <tr className="text-center font-bold">
                            <td colSpan="2" className="py-2 px-4 text-left border-none">RAPPEL DES ORDRES ANTERIEURS:</td>
                            <td className="py-2 px-4 border border-gray-300 border-l-2 border-r-2">415 360 FCFA</td>
                            <td className="py-2 px-4 border-none"></td>
                            <td className="py-2 px-4 border-none"></td>
                            <td className="py-2 px-4 border-none"></td>
                        </tr>
                        <tr className="text-center font-bold">
                            <td colSpan="2" className="py-2 px-4 text-left border-none">TOTAL GENERAL:</td>
                            <td className="py-2 px-4 border border-gray-300 border-l-2 border-r-2">415 360 FCFA</td>
                            <td className="py-2 px-4 border-none"></td>
                            <td className="py-2 px-4 border-none"></td>
                            <td className="py-2 px-4 border-none"></td>
                        </tr>
                    </tbody>
                </table>

                {/* Note de bas de page */}
                <p className="mt-6 text-center">
                    Arrêté le présent état des ordres de paiement à la somme totale de deux cent cinquante mille francs CFA.
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
};

export default PaymentOrderDetails;
