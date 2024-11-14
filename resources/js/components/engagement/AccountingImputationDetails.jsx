// AccountingImputationDetails.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountingImputationDetails = ({ engagementId }) => {
    const [imputation, setImputation] = useState(null);

    useEffect(() => {
        fetchImputation();
    }, []);

    const fetchImputation = async () => {
        try {
            const response = await axios.get(`/api/engagements/${engagementId}/accounting-imputation`);
            setImputation(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'imputation comptable:', error);
        }
    };

    if (!imputation || !imputation.entries) {
        return <div>Aucune imputation comptable disponible.</div>;
    }

    return (
        <div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead>
                    <tr>
                        <th colSpan="6" className="py-2 px-4 bg-gray-200 text-center text-lg font-bold border-b border-gray-300">
                            Imputation Comptable
                        </th>
                    </tr>
                    <tr>
                        <th className="py-2 px-4 border border-gray-300" rowSpan="2">N°</th>
                        <th colSpan="2" className="py-2 px-4 border border-gray-300">N° de Compte</th>
                        <th rowSpan="2" className="py-2 px-4 border border-gray-300">REFERENCE</th>
                        <th colSpan="2" className="py-2 px-4 border border-gray-300">Montant</th>
                    </tr>
                    <tr>
                        <th className="py-2 px-4 border border-gray-300">Débit</th>
                        <th className="py-2 px-4 border border-gray-300">Crédit</th>
                        <th className="py-2 px-4 border border-gray-300">Débit</th>
                        <th className="py-2 px-4 border border-gray-300">Crédit</th>
                    </tr>
                </thead>
                <tbody>
                    {imputation.entries.map((entry, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border border-gray-300">{index + 1}</td>
                            <td className="py-2 px-4 border border-gray-300">{entry.account_type === 'Débit' ? entry.account_number : ''}</td>
                            <td className="py-2 px-4 border border-gray-300">{entry.account_type === 'Crédit' ? entry.account_number : ''}</td>
                            {index === 0 && (
                                <td rowSpan={imputation.entries.length} className="py-2 px-4 border border-gray-300 text-center">
                                    {imputation.description || ''}
                                </td>
                            )}
                            <td className="py-2 px-4 border border-gray-300">{entry.amount_type === 'Débit' ? entry.amount_placeholder : ''}</td>
                            <td className="py-2 px-4 border border-gray-300">{entry.amount_type === 'Crédit' ? entry.amount_placeholder : ''}</td>
                        </tr>
                    ))}
                    {/* Vous pouvez ajouter le calcul du total ici si nécessaire */}
                </tbody>
            </table>
        </div>
    );
};

export default AccountingImputationDetails;
