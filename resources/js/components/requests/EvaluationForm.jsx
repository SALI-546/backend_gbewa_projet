import React, { useState } from 'react';

const EvaluationForm = ({ request, closeModal }) => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to submit the form goes here
        console.log('Form Submitted', { status });
        closeModal(); // Close the modal after submission
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white shadow-lg rounded-lg w-1/3 p-6">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">Demande {request.id}</h2>
                    <h3 className="text-xl text-gray-600">Demande d’évaluation du personnel</h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <h4 className="text-lg font-semibold">Type d’évaluation</h4>
                        <div className="flex space-x-4 mt-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Accepté"
                                    className="form-radio h-4 w-4 text-green-500"
                                    onChange={() => setStatus('Accepté')}
                                />
                                <span className="text-green-500">Accepté</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="status"
                                    value="Rejeté"
                                    className="form-radio h-4 w-4 text-red-500"
                                    onChange={() => setStatus('Rejeté')}
                                />
                                <span className="text-red-500">Rejeté</span>
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-semibold mb-2">Motif</label>
                        <textarea
                            className="w-full border rounded-lg px-4 py-2"
                            rows="4"
                            placeholder="Écrire le motif ici"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                            OK
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EvaluationForm;
