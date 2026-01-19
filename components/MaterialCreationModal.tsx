
import React, { useState, useEffect } from 'react';
import { Material } from '../types';
import { getAIAssistantResponse } from '../services/geminiService';

interface MaterialCreationModalProps {
  onClose: () => void;
  onSubmit: (material: Material) => void;
}

const MaterialCreationModal: React.FC<MaterialCreationModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '3D Printer',
    externalUrl: '',
    imageUrl: '',
    description: ''
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [imageValid, setImageValid] = useState(false);

  useEffect(() => {
    if (formData.imageUrl) {
      const img = new Image();
      img.src = formData.imageUrl;
      img.onload = () => setImageValid(true);
      img.onerror = () => setImageValid(false);
    } else {
      setImageValid(false);
    }
  }, [formData.imageUrl]);

  const handleAIHelp = async () => {
    if (!formData.name) return;
    setIsGeneratingAI(true);
    const context = `A lab material named "${formData.name}" in category "${formData.category}".`;
    const prompt = `Write a professional 1-sentence product description for this STEM lab tool.`;
    const aiText = await getAIAssistantResponse(prompt, context);
    setFormData(prev => ({ ...prev, description: aiText || prev.description }));
    setIsGeneratingAI(false);
  };

  const handleSave = () => {
    if (!formData.name || !formData.imageUrl) {
      alert("Please enter at least a name and a valid image URL.");
      return;
    }

    const newMaterial: Material = {
      id: `m-custom-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      quantity: '1 unit',
      status: 'In Stock',
      priceRange: '', // No longer collected
      imageUrl: formData.imageUrl,
      description: formData.description,
      externalUrl: formData.externalUrl || '#'
    };

    onSubmit(newMaterial);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Add New Toolkit Item</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Register a new tool or material to the lab catalog</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all flex items-center justify-center">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 flex flex-col lg:flex-row gap-12 custom-scrollbar">
          
          <div className="flex-1 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Product Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Raspberry Pi 5"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none cursor-pointer"
                >
                  <option>3D Printer</option>
                  <option>Coding</option>
                  <option>Accessories</option>
                  <option>Filament</option>
                  <option>Robotics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Official Website Link</label>
                <input 
                  type="text" 
                  value={formData.externalUrl} 
                  onChange={(e) => setFormData({...formData, externalUrl: e.target.value})}
                  placeholder="e.g., https://www.eptecstore.com/..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                <button 
                  onClick={handleAIHelp}
                  disabled={isGeneratingAI || !formData.name}
                  className="text-[10px] font-black text-blue-500 hover:text-blue-600 uppercase tracking-widest flex items-center gap-1.5 transition-colors disabled:opacity-30"
                >
                  {isGeneratingAI ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                  AI Suggest
                </button>
              </div>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly explain what this item is used for..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium resize-none"
              ></textarea>
            </div>
          </div>

          <div className="lg:w-80 shrink-0 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Product Image Link</label>
              <input 
                type="text" 
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="Paste image URL here..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-[11px] font-bold"
              />

              <div className="aspect-square bg-slate-100 rounded-[2.5rem] border-2 border-dashed border-slate-200 overflow-hidden flex flex-col items-center justify-center relative shadow-inner">
                {imageValid ? (
                  <img src={formData.imageUrl} className="w-full h-full object-contain p-8 animate-in fade-in duration-700" alt="Preview" />
                ) : (
                  <div className="text-center px-6">
                    <i className="fa-solid fa-box-open text-3xl text-slate-300 mb-2"></i>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Image Preview</p>
                    <p className="text-[9px] text-slate-300 mt-1">URL must be a direct link to an image</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
               <div className="flex items-center gap-2 mb-2 text-blue-600">
                 <i className="fa-solid fa-circle-info"></i>
                 <span className="text-[10px] font-black uppercase tracking-widest">Inventory Rules</span>
               </div>
               <p className="text-[10px] text-blue-700/70 font-bold leading-relaxed">
                 New products are added to the general lab inventory for all students to reference in their projects.
               </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <button 
            onClick={onClose}
            className="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
          >
            Add to Toolkit
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCreationModal;
