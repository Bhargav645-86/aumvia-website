'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Briefcase,
  Calendar, Shield, Upload, CheckCircle, AlertCircle,
  Save, Star, Clock, FileText, Edit2
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  selected: boolean;
}

interface Availability {
  day: string;
  available: boolean;
  startTime: string;
  endTime: string;
}

export default function JobSeekerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'skills' | 'availability' | 'verification'>('details');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '07700 900123',
    postcode: 'M1 2AB',
    radius: 5,
    bio: 'Experienced barista with 3 years of experience in busy cafes. Reliable, punctual, and great with customers.'
  });

  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'Barista', selected: true },
    { id: '2', name: 'Server/Waitstaff', selected: true },
    { id: '3', name: 'Kitchen Assistant', selected: false },
    { id: '4', name: 'Food Prep', selected: false },
    { id: '5', name: 'Cashier', selected: true },
    { id: '6', name: 'Bartender', selected: false },
    { id: '7', name: 'Delivery Driver', selected: false },
    { id: '8', name: 'Cleaning', selected: false },
  ]);

  const [availability, setAvailability] = useState<Availability[]>([
    { day: 'Monday', available: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Tuesday', available: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Wednesday', available: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Thursday', available: true, startTime: '08:00', endTime: '18:00' },
    { day: 'Friday', available: true, startTime: '08:00', endTime: '22:00' },
    { day: 'Saturday', available: true, startTime: '09:00', endTime: '22:00' },
    { day: 'Sunday', available: false, startTime: '10:00', endTime: '16:00' },
  ]);

  const [verificationStatus] = useState({
    idVerified: true,
    rightToWork: true,
    foodHygiene: false,
    dbsCheck: false
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const handleSave = async () => {
    setSaveStatus('saving');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const toggleSkill = (skillId: string) => {
    setSkills(skills.map(s => 
      s.id === skillId ? { ...s, selected: !s.selected } : s
    ));
  };

  const toggleAvailability = (day: string) => {
    setAvailability(availability.map(a => 
      a.day === day ? { ...a, available: !a.available } : a
    ));
  };

  const handleBack = () => {
    router.push('/dashboard/jobseeker');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-indigo-900">My Profile</h1>
              <p className="text-sm text-gray-600">Manage your personal information and preferences</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
              {(session.user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{session.user?.name || 'Job Seeker'}</h2>
              <p className="text-gray-600">{session.user?.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm text-amber-600">
                  <Star className="w-4 h-4 fill-current" />
                  4.8 Rating
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Briefcase className="w-4 h-4" />
                  24 Shifts Completed
                </span>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              <Edit2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'details'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            Details
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'skills'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Skills
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'availability'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="w-5 h-5" />
            Availability
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'verification'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Shield className="w-5 h-5" />
            Verification
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-6">Personal Information</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Postcode
                  </label>
                  <input
                    type="text"
                    value={profileData.postcode}
                    onChange={(e) => setProfileData({...profileData, postcode: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Radius (miles)
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={profileData.radius}
                  onChange={(e) => setProfileData({...profileData, radius: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>1 mile</span>
                  <span className="font-semibold text-indigo-600">{profileData.radius} miles</span>
                  <span>20 miles</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio / About Me
                </label>
                <textarea
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Tell employers about yourself..."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    Changes saved
                  </span>
                )}
                {saveStatus === 'idle' && <span></span>}
                <button
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Skills & Roles</h3>
            <p className="text-gray-600 mb-6">Select the roles you can perform. This helps match you with relevant shifts.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {skills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    skill.selected 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{skill.name}</span>
                    {skill.selected && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-500">
                {skills.filter(s => s.selected).length} skills selected
              </p>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Skills
              </button>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Weekly Availability</h3>
            <p className="text-gray-600 mb-6">Set your available hours for each day. Shifts outside these times will not be shown to you.</p>
            
            <div className="space-y-4">
              {availability.map((day) => (
                <div 
                  key={day.day}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    day.available ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleAvailability(day.day)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          day.available ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          day.available ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                      <span className="font-semibold text-gray-900 w-24">{day.day}</span>
                    </div>
                    
                    {day.available && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={day.startTime}
                          onChange={(e) => setAvailability(availability.map(a => 
                            a.day === day.day ? { ...a, startTime: e.target.value } : a
                          ))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={day.endTime}
                          onChange={(e) => setAvailability(availability.map(a => 
                            a.day === day.day ? { ...a, endTime: e.target.value } : a
                          ))}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                    
                    {!day.available && (
                      <span className="text-gray-400 italic">Not available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-6">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Availability
              </button>
            </div>
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Verification Status</h3>
            <p className="text-gray-600 mb-6">Complete these verifications to access more opportunities and build trust with employers.</p>
            
            <div className="space-y-4">
              <div className={`p-5 rounded-xl border-2 ${
                verificationStatus.idVerified ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      verificationStatus.idVerified ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <FileText className={`w-6 h-6 ${verificationStatus.idVerified ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">ID Verification</h4>
                      <p className="text-sm text-gray-600">Upload a valid photo ID</p>
                    </div>
                  </div>
                  {verificationStatus.idVerified ? (
                    <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Verified
                    </span>
                  ) : (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              <div className={`p-5 rounded-xl border-2 ${
                verificationStatus.rightToWork ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      verificationStatus.rightToWork ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <Shield className={`w-6 h-6 ${verificationStatus.rightToWork ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Right to Work</h4>
                      <p className="text-sm text-gray-600">Confirm your UK work eligibility</p>
                    </div>
                  </div>
                  {verificationStatus.rightToWork ? (
                    <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Verified
                    </span>
                  ) : (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              <div className={`p-5 rounded-xl border-2 ${
                verificationStatus.foodHygiene ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      verificationStatus.foodHygiene ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}>
                      <FileText className={`w-6 h-6 ${verificationStatus.foodHygiene ? 'text-emerald-600' : 'text-amber-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Food Hygiene Certificate</h4>
                      <p className="text-sm text-gray-600">Level 2 Food Safety certification</p>
                    </div>
                  </div>
                  {verificationStatus.foodHygiene ? (
                    <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Verified
                    </span>
                  ) : (
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>

              <div className={`p-5 rounded-xl border-2 ${
                verificationStatus.dbsCheck ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      verificationStatus.dbsCheck ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}>
                      <Shield className={`w-6 h-6 ${verificationStatus.dbsCheck ? 'text-emerald-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">DBS Check (Optional)</h4>
                      <p className="text-sm text-gray-600">Enhanced background check</p>
                    </div>
                  </div>
                  {verificationStatus.dbsCheck ? (
                    <span className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      Verified
                    </span>
                  ) : (
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-900">Why verify?</p>
                  <p className="text-sm text-indigo-700">Verified workers get 3x more shift offers and access to premium opportunities with higher pay rates.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
