import React from 'react';
import { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, Save, ArrowLeft, CheckCircle2, FileText, Briefcase, GraduationCap, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SeekerProfile = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(40);
  
  const [personalDetails, setPersonalDetails] = useState({
    name: 'Amit Kumar',
    phone: '+91 9876543210',
    age: '26',
    city: 'Indore',
  });

  const [experience, setExperience] = useState([
    { id: 1, role: 'Math Teacher', company: 'Bright Future Academy', duration: '2021 - Present', city: 'Indore' }
  ]);

  const [education, setEducation] = useState([
    { id: 1, degree: 'B.Sc. Mathematics', institution: 'Devi Ahilya Vishwavidyalaya', year: '2020' }
  ]);

  const [certificates, setCertificates] = useState([
    { id: 1, name: 'B.Ed Degree Certificate', file: 'bed_certificate.pdf' }
  ]);
  
  useEffect(() => {
    const profileSaved = localStorage.getItem('seekerProfileSaved') === 'true';
    if(profileSaved) {
      setProgress(100);
      setPhoto(localStorage.getItem('seekerPhoto'));
    }
  }, []);

  useEffect(() => {
    let p = 20; // base progress
    if (photo) p += 20;
    if (personalDetails.name && personalDetails.phone && personalDetails.city) p += 20;
    if (experience.length > 0 && experience[0].role) p += 20;
    if (education.length > 0 && education[0].degree) p += 10;
    if (certificates.length > 0) p += 10;
    
    setProgress(p);
  }, [photo, personalDetails, experience, education, certificates]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setProgress(100);
      localStorage.setItem('seekerProfileSaved', 'true');
      if(photo) localStorage.setItem('seekerPhoto', photo);
      
      // Save other data to mock DB
      localStorage.setItem('seekerName', personalDetails.name);
      
      const el = document.getElementById('success-msg');
      if(el) {
         el.classList.remove('hidden');
         setTimeout(() => el.classList.add('hidden'), 3000);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-blue-900 text-white p-6 shadow-md sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => navigate('/seeker/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
           <h1 className="text-xl font-bold">Complete Your Profile</h1>
           <div className="w-full bg-blue-950 h-2 mt-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-1000 ease-in-out" style={{ width: `${progress}%` }}></div>
           </div>
           <p className="text-xs text-blue-200 mt-1">{progress}% Completed</p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 space-y-6 mt-6">
        
        <div id="success-msg" className="hidden bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">Profile saved successfully. Progress updated!</span>
        </div>

        {progress === 100 && (
           <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 rounded-2xl shadow-lg text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div>
                <h3 className="font-bold text-xl mb-1 text-amber-400">Profile Match: Highly Compatible!</h3>
                <p className="text-blue-100 text-sm">Your skills and certificates match the 'Senior Stylist' requirements. You are eligible for the AI Interview.</p>
             </div>
             <button onClick={() => navigate('/interview/practice')} className="bg-amber-500 text-blue-950 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-colors whitespace-nowrap flex items-center gap-2">
                <PlayCircle size={20}/> Start AI Interview
             </button>
           </div>
        )}
        {/* Profile Photo */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
              {photo ? (
                <img src={photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-400 font-bold">AK</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 p-3 bg-amber-500 text-white rounded-full cursor-pointer shadow-lg hover:bg-amber-600 transition-colors">
              <Camera size={20} />
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
               Profile Photo 
               {photo && <CheckCircle2 size={24} className="text-green-500" />}
            </h2>
            <p className="text-gray-500 text-sm">A professional photo increases your chances of getting hired by 40%.</p>
          </div>
        </section>

        {/* Basic Details */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b flex items-center justify-between">
            Personal Details
            {personalDetails.name && personalDetails.phone && personalDetails.city && <CheckCircle2 size={20} className="text-green-500" />}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
              <input type="text" value={personalDetails.name} onChange={e => setPersonalDetails({...personalDetails, name: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Mobile Number</label>
              <input type="tel" value={personalDetails.phone} onChange={e => setPersonalDetails({...personalDetails, phone: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Age</label>
              <input type="number" value={personalDetails.age} onChange={e => setPersonalDetails({...personalDetails, age: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">City</label>
              <input type="text" value={personalDetails.city} onChange={e => setPersonalDetails({...personalDetails, city: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </section>

        {/* Work Experience */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Work Experience
              {experience.length > 0 && experience[0].role && <CheckCircle2 size={20} className="text-green-500" />}
            </h2>
            <button onClick={() => setExperience([...experience, {id: Date.now(), role: '', company: '', duration: '', city: ''}])} className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 text-sm bg-blue-50 px-3 py-1.5 rounded-lg">
              <Plus size={16} /> Add 
            </button>
          </div>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={exp.id} className="p-4 border rounded-xl bg-gray-50 relative group">
                <button onClick={() => setExperience(experience.filter(e => e.id !== exp.id))} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mr-8">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Job Role / Title</label>
                    <input type="text" value={exp.role} onChange={e => {
                      const newExp = [...experience];
                      newExp[index].role = e.target.value;
                      setExperience(newExp);
                    }} className="w-full border p-2 rounded-lg" placeholder="e.g. Maths Teacher" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Company / Institution</label>
                    <input type="text" value={exp.company} onChange={e => {
                      const newExp = [...experience];
                      newExp[index].company = e.target.value;
                      setExperience(newExp);
                    }} className="w-full border p-2 rounded-lg" placeholder="e.g. DPS School" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Duration</label>
                    <input type="text" value={exp.duration} onChange={e => {
                      const newExp = [...experience];
                      newExp[index].duration = e.target.value;
                      setExperience(newExp);
                    }} className="w-full border p-2 rounded-lg" placeholder="e.g. 2020 - 2022" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input type="text" value={exp.city} onChange={e => {
                      const newExp = [...experience];
                      newExp[index].city = e.target.value;
                      setExperience(newExp);
                    }} className="w-full border p-2 rounded-lg" placeholder="e.g. Indore" />
                  </div>
                </div>
              </div>
            ))}
            {experience.length === 0 && (
              <p className="text-gray-500 text-sm italic">No experience added. Click 'Add' if you have previous work experience.</p>
            )}
          </div>
        </section>

        {/* Education & Certificates */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border">
           <div className="flex justify-between items-center mb-4 pb-2 border-b">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               Education & Certificates
               {education.length > 0 && education[0].degree && <CheckCircle2 size={20} className="text-green-500" />}
             </h2>
             <Link to="/upload" className="text-amber-600 font-medium hover:text-amber-800 flex items-center gap-1 text-sm bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
               <Plus size={16} /> Upload New Document
             </Link>
           </div>
           
           <div className="space-y-3">
             {education.map(edu => (
               <div key={edu.id} className="flex items-start gap-3 p-4 border rounded-xl bg-gray-50">
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><GraduationCap size={20} /></div>
                 <div>
                   <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                   <p className="text-sm text-gray-500">{edu.institution} • {edu.year}</p>
                 </div>
               </div>
             ))}

             {certificates.map(cert => (
               <div key={cert.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border border-green-200 bg-green-50 rounded-xl relative">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-200 text-green-700 rounded-lg"><FileText size={20} /></div>
                   <div>
                     <h4 className="font-bold text-gray-900">{cert.name}</h4>
                     <p className="text-sm text-gray-500">{cert.file}</p>
                   </div>
                 </div>
                 <div className="text-green-700 text-sm font-semibold flex items-center gap-1">
                   <CheckCircle2 size={16} /> Validated by AI
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Save/Complete button */}
        <div className="pt-4 flex justify-end gap-4">
          <button onClick={() => navigate('/seeker/dashboard')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold bg-white hover:bg-gray-50 shadow-sm transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
            <Save size={20} /> {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;
