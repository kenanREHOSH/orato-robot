import React, { useState } from 'react';
import { Shield, Database, HelpCircle, ChevronRight, X } from 'lucide-react';

/**
 * Manages the display and access to user data download, Privacy Policy, and Terms of Service.
 */
const PrivacyData: React.FC<{ userId?: string }> = ({ userId }) => {
    // For manage visibility of privacy policy modal.
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    // For manage visibility of terms of service modal.
    const [showTermsModal, setShowTermsModal] = useState(false);

    /**
     * For handling personal data download request.
     */
    const handleDownloadData = (): void => {
        if (!userId) {
            alert('Please log in to download your data.');
            return;
        }
        window.open(`http://localhost:5002/api/settings/${userId}/download`, '_blank');
    };

    /**
     * For toggling the visibility of the Privacy Policy modal.
     */
    const handlePrivacyPolicy = (): void => {
        setShowPrivacyModal(true);
    };

    /**
     * For toggling the visibility of the Terms of Service modal.
     */
    const handleTermsOfService = (): void => {
        setShowTermsModal(true);
    };

    // For format the current date to serve as the effective date for legal documents.
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Section Header */}
            <div className="flex items-center mb-6">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                    <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Privacy & Data</h2>
            </div>

            {/* Action Buttons List */}
            <div className="space-y-2">
                {/* Download Data Trigger */}
                <button
                    onClick={handleDownloadData}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="flex items-center">
                        <Database className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-base font-medium text-gray-900">Download My Data</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                {/* Privacy Policy Trigger */}
                <button
                    onClick={handlePrivacyPolicy}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="flex items-center">
                        <Shield className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-base font-medium text-gray-900">Privacy Policy</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>

                {/* Terms of Service Trigger */}
                <button
                    onClick={handleTermsOfService}
                    className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <div className="flex items-center">
                        <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-base font-medium text-gray-900">Terms of Service</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </button>
            </div>

            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowPrivacyModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
                        <p className="text-sm text-gray-500 mb-6">Effective Date: {currentDate}</p>

                        {/* Privacy Policy Content */}
                        <div className="text-gray-600 space-y-6">
                            <p>Orato is committed to protecting your personal data in accordance with applicable data protection laws, including the Sri Lanka Personal Data Protection Act, No. 9 of 2022 (“PDPA”).</p>
                            <p>By using the Orato platform, you agree to the collection and use of information in accordance with this Policy.</p>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Information We Collect</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-medium">a) Personal Identification Data</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Full name</li>
                                            <li>Email address</li>
                                            <li>Phone number</li>
                                            <li>Date of birth (if required)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-medium">b) Account & Academic Data</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Enrollment records</li>
                                            <li>Attendance data</li>
                                            <li>Participation records</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-medium">c) Live Session Data</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>Audio recordings</li>
                                            <li>Chat communications</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-medium">d) Technical Data</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>IP address</li>
                                            <li>Browser/device information</li>
                                            <li>Usage logs</li>
                                            <li>Cookies</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Legal Basis for Processing</h3>
                                <p>We process personal data based on:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li>Consent (e.g., session recordings)</li>
                                    <li>Contractual necessity (delivery of language training services)</li>
                                    <li>Legal obligations under Sri Lankan law</li>
                                    <li>Legitimate interests, including quality assurance and platform security</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Compliance with Sri Lanka Personal Data Protection Act (2022)</h3>
                                <p>Orato processes personal data in accordance with the principles established under the Sri Lanka Personal Data Protection Act, No. 9 of 2022, including:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li>Lawful and transparent processing</li>
                                    <li>Purpose limitation</li>
                                    <li>Data minimization</li>
                                    <li>Accuracy of data</li>
                                    <li>Storage limitation</li>
                                    <li>Integrity and confidentiality</li>
                                    <li>Accountability</li>
                                </ul>
                                <p className="mt-2">Where required, consent will be obtained before processing sensitive or recorded data. If a Data Protection Authority is formally established under the Act, Orato will cooperate with and comply with its regulatory requirements.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Recording of Live Sessions</h3>
                                <p>Live classes are recorded. By participating in live sessions, you explicitly consent to the recording of:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li>Audio</li>
                                    <li>Shared screen content</li>
                                    <li>Chat interactions</li>
                                </ul>
                                <p className="mt-2 text-sm font-medium">Recordings are used for internal educational quality purposes only and are not publicly distributed. Users are strictly prohibited from independently recording sessions.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Data Sharing</h3>
                                <p>We do not sell personal data. We may share data with:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li>Cloud hosting providers</li>
                                    <li>IT support providers</li>
                                    <li>Legal authorities when required by law</li>
                                </ul>
                                <p className="mt-2">All third parties are contractually required to safeguard personal data.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Data Retention</h3>
                                <p>Personal data is retained only as long as necessary to deliver services, fulfill contractual obligations, comply with legal requirements, and resolve disputes. Recorded sessions are retained for a reasonable operational period unless legal obligations require longer retention.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Your Data Protection Rights</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="font-semibold">1. Right of Access</p>
                                        <p>You may request confirmation of whether we process your personal data and obtain a copy.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">2. Right to Rectification</p>
                                        <p>You may request correction of inaccurate or incomplete data.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">3. Right to Erasure (“Right to be Forgotten”)</p>
                                        <p>You may request deletion of personal data where it is no longer necessary, you withdraw consent, or processing is unlawful (subject to legal retention requirements).</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">4. Right to Restrict Processing</p>
                                        <p>You may request temporary suspension of data processing in certain circumstances.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">5. Right to Object</p>
                                        <p>You may object to processing based on legitimate interests.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">6. Right to Withdraw Consent</p>
                                        <p>Where processing is based on consent (e.g., recordings), you may withdraw consent. Withdrawal does not affect processing already completed.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">7. Right to Data Portability</p>
                                        <p>Where technically feasible, you may request a copy of your personal data in a structured format.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">8. Right to Lodge a Complaint</p>
                                        <p>You may lodge a complaint with the relevant Sri Lankan regulatory authority once formally operational.</p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Data Security</h3>
                                <p>We implement appropriate technical and organizational safeguards, including restricted system access, secure data storage, and role-based access control. However, no method of internet transmission is entirely secure.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">9. International Data Transfers</h3>
                                <p>If personal data is stored using international cloud service providers, appropriate safeguards are implemented to ensure compliance with applicable data protection standards.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">10. Children’s Privacy</h3>
                                <p>Users under 18 must obtain parental or legal guardian consent before using the Platform. We do not knowingly process children’s data without appropriate authorization.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">11. Changes to This Policy</h3>
                                <p>We may update this Privacy Policy periodically. Continued use of the Platform after changes constitutes acceptance of the revised Policy.</p>
                            </section>

                            <section className="pb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">12. Contact Information</h3>
                                <div className="mt-2 font-medium">
                                    <p>Orato</p>
                                    <p>oratoplatform@gmail.lk</p>
                                    <p>Sri Lanka</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms of Service Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Terms of Service</h2>
                        <p className="text-sm text-gray-500 mb-6">Effective Date: {currentDate}</p>

                        <div className="text-gray-600 space-y-6">
                            <p>Welcome to Orato. By accessing or using the Orato language training platform you agree to be bound by these Terms of Service. If you do not agree, you must not use the Platform.</p>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Service Description</h3>
                                <p>Orato provides live online English language training sessions conducted through virtual classroom technology. Sessions may be recorded for educational, quality control, and internal training purposes.</p>
                                <p className="mt-2">Orato does not issue certificates and does not provide accredited qualifications.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Eligibility</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>You must be at least 12 years old to register.</li>
                                    <li>Users under 18 must obtain parental or legal guardian consent.</li>
                                    <li>By registering, you confirm that all information provided is accurate and complete.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Account Registration & Security</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Each user may maintain only one account.</li>
                                    <li>You are responsible for maintaining confidentiality of login credentials.</li>
                                    <li>Account sharing is strictly prohibited.</li>
                                    <li>Orato reserves the right to suspend accounts suspected of misuse.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Live Sessions & Recording Consent</h3>
                                <p>By participating in live sessions, you acknowledge and consent to:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li>Audio and/or video recording of sessions.</li>
                                    <li>Use of recordings for internal educational purposes.</li>
                                    <li>Storage of recordings for a reasonable period.</li>
                                </ul>
                                <p className="mt-2">Users are strictly prohibited from recording, copying, distributing, or reproducing any session content without written permission from Orato. If you do not consent to recording, you must not participate in live sessions.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Intellectual Property Rights</h3>
                                <p>All course materials, including but not limited to lesson plans, videos, recordings, worksheets, presentations, and teaching materials are the exclusive property of Orato.</p>
                                <p className="mt-2">Materials are licensed for personal educational use only. Reproduction, resale, redistribution, screen recording, or commercial use is strictly prohibited.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">7. User Conduct</h3>
                                <p>Users agree to:</p>
                                <ul className="list-disc pl-5 space-y-1 mt-2">
                                    <li>Communicate respectfully during sessions.</li>
                                    <li>Avoid harassment, abusive language, or disruptive behavior.</li>
                                    <li>Refrain from sharing login credentials.</li>
                                    <li>Not engage in unlawful or harmful activity.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">8. No Guarantee of Results</h3>
                                <p>Orato does not guarantee English fluency, examination success (including IELTS or other tests), or employment outcomes. Learning outcomes depend on individual effort and participation.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">9. Technology Disclaimer</h3>
                                <p>Users are responsible for a stable internet connection, compatible devices, and proper audio/video functionality. Orato is not liable for disruptions caused by technical failures outside its control.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">10. Limitation of Liability</h3>
                                <p>To the maximum extent permitted under Sri Lankan law, Orato shall not be liable for indirect, incidental, or consequential damages. Total liability shall not exceed the amount paid by the user for the course.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">11. Termination</h3>
                                <p>Orato may suspend or terminate access if Terms are violated or misconduct occurs.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">12. Governing Law</h3>
                                <p>These Terms shall be governed by and construed in accordance with the laws of Sri Lanka. Any disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">13. Changes to Terms</h3>
                                <p>Orato reserves the right to modify these Terms at any time. Continued use of the Platform constitutes acceptance of updated Terms.</p>
                            </section>

                            <section className="pb-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">14. Contact Information</h3>
                                <p>For legal or general inquiries:</p>
                                <div className="mt-2 font-medium">
                                    <p>Orato</p>
                                    <p>oratoplatform@gmail.lk</p>
                                    <p>Sri Lanka</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrivacyData;