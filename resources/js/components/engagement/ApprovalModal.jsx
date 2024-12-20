import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const ApprovalModal = ({ onClose, onSubmit }) => {
    const [avis, setAvis] = useState('');
    const [signatureType, setSignatureType] = useState('');
    const [signatureImage, setSignatureImage] = useState('');
    const [observation, setObservation] = useState('');
    const sigPadRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!avis || !signatureType || !signatureImage) {
            alert('Veuillez remplir tous les champs et signer.');
            return;
        }
        onSubmit({ avis, signature_type: signatureType, signature_image: signatureImage, observation });
    };

    const clearSignature = () => {
        sigPadRef.current.clear();
        setSignatureImage('');
    };

    const handleEndSignature = () => {
        if (!sigPadRef.current.isEmpty()) {
            const dataURL = sigPadRef.current.getTrimmedCanvas().toDataURL('image/png');
            setSignatureImage(dataURL);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Ajouter une Approbation</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black focus:outline-none text-2xl">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Avis */}
                    <div>
                        <label className="block font-medium mb-1">Avis</label>
                        <select
                            value={avis}
                            onChange={(e) => setAvis(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            required
                        >
                            <option value="">Sélectionner un avis</option>
                            <option value="Favorable">Favorable</option>
                            <option value="Défavorable">Défavorable</option>
                        </select>
                    </div>

                    {/* Signature Type */}
                    <div>
                        <label className="block font-medium mb-1">Type de Signature</label>
                        <select
                            value={signatureType}
                            onChange={(e) => setSignatureType(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            required
                        >
                            <option value="">Sélectionner un type de signature</option>
                            <option value="Visa Comptable">Visa Comptable</option>
                            <option value="Visa Chef Comptable">Visa Chef Comptable</option>
                            <option value="Visa DAF">Visa DAF</option>
                            <option value="Visa DE">Visa DE</option>
                        </select>
                    </div>

                    {/* Signature Image */}
                    <div>
                        <label className="block font-medium mb-1">Signature</label>
                        <div className="border rounded-lg p-2">
                            <SignatureCanvas
                                penColor="black"
                                canvasProps={{ width: 300, height: 100, className: 'sigCanvas' }}
                                ref={sigPadRef}
                                onEnd={handleEndSignature}
                            />
                            <button
                                type="button"
                                onClick={clearSignature}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg"
                            >
                                Effacer
                            </button>
                        </div>
                    </div>

                    {signatureImage && (
                        <div>
                            <p className="font-medium mb-1">Aperçu de la signature :</p>
                            <img src={signatureImage} alt="Signature" className="w-full h-auto border rounded-lg" />
                        </div>
                    )}

                    {/* Observation */}
                    <div>
                        <label className="block font-medium mb-1">Observation</label>
                        <textarea
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            rows="3"
                            placeholder="Ajouter une observation (facultatif)"
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default ApprovalModal;
