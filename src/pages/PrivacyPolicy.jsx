import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-white min-h-screen py-20 px-8 font-serif text-slate-900">
            <div className="max-w-3xl mx-auto">
                {/* Plain Document Header */}
                <div className="border-b-2 border-slate-900 pb-8 mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Privacy Policy</h1>
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Effective Date: 1 July 2026 · Last Updated: July 2026</p>
                </div>

                {/* Unstyled Text Content */}
                <div className="text-base leading-relaxed whitespace-pre-line space-y-6">
                    {`TipsyTheoryy ("we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, why we collect it, how we use it, and your rights regarding it. By using TipsyTheoryy — whether as a customer, merchant partner, or delivery rider — you agree to this policy.

1. WHO WE ARE
TipsyTheoryy is an on-demand liquor delivery platform operated by Emmanuel Odongo (sole trader), registered and operating in Kenya. We connect customers with licensed liquor merchants and independent delivery riders across Kenya.
Contact: support@s.tipsytheoryy.com

2. INFORMATION WE COLLECT
2.1 Information you provide directly
- Full name, email address, phone number, and password when you create an account
- Date of birth, submitted via our age verification wheel picker, used solely to confirm you are 18 years of age or older
- Delivery address and GPS location coordinates, captured once at checkout
- Payment-related information — we do not store your M-PESA PIN. STK push payment requests are processed directly by Safaricom Daraja. We store only the transaction reference and status.
- Photos or documents you upload (e.g. profile photo, rider identification documents)
- Messages or communications you send to our support team

2.2 Information collected automatically
- Device identifiers, browser type, and operating system
- IP address and approximate location derived from it
- App usage data including screens visited, time spent, and actions taken
- Firebase Cloud Messaging (FCM) device token for push notifications
- Behavioural signals used in our risk-based age verification system (see Section 5)
- Rider GPS location — collected only during active deliveries, every 30–60 seconds, solely to enable the customer order tracking feature. Rider tracking stops immediately upon delivery completion.

3. HOW WE USE YOUR INFORMATION
We use your personal information only for the following purposes:
- To create and manage your account
- To process orders and coordinate deliveries between customers, merchants, and riders
- To verify that you meet the minimum age requirement of 18 years (risk-based, not for every interaction)
- To send you order confirmations, delivery updates, and service notifications via push notification, SMS, or Telegram
- To enable merchant partners to manage their stores, products, and analytics (merchant data only)
- To enable riders to receive delivery assignments and navigate to customers
- To detect and prevent fraud, underage purchasing, and abuse of the platform
- To improve the platform through aggregated, anonymised usage analytics
- To comply with applicable Kenyan law, including alcohol licensing regulations

Note: We do not use your personal data for advertising to third parties. TipsyTheoryy products are ad-free.

4. LEGAL BASIS FOR PROCESSING
Under applicable Kenyan data protection law (the Data Protection Act, 2019), we process your personal data on the following bases:
- Contract performance — processing necessary to fulfil your order or provide our service
- Legitimate interests — fraud prevention, platform security, age verification, and service improvement
- Legal obligation — compliance with the Alcoholic Drinks Control Act and other applicable Kenyan statutes
- Consent — where you have provided explicit consent, such as for optional marketing communications

5. AGE VERIFICATION
Kenyan law prohibits the sale of alcohol to persons under 18 years of age. TipsyTheoryy implements a risk-based intelligent age verification system designed to protect minors without creating friction for legitimate adult users.

5.1 How it works
- All users provide their date of birth via a date-of-birth wheel picker during account registration. This is mandatory.
- Our system silently analyses behavioural signals — including the time taken to enter your date of birth, typing patterns, device consistency, and account history — to assign a risk score.
- The vast majority of legitimate adult users will experience no additional verification steps.
- Users who trigger elevated risk scores (e.g. new accounts placing high-value first orders, suspicious input patterns, logins from new devices after long inactivity) may be prompted to provide additional verification such as a government-issued ID scan or selfie.
- Location intelligence is used where relevant — users in areas with known underage access risk patterns may be subject to stricter verification thresholds.

5.2 Data used for age verification
Age verification data — including date of birth and any uploaded ID documents — is used solely for the purpose of confirming you are 18 or older. It is not shared with merchants, riders, or third parties, and is not used for any other purpose.

Note: We treat your verification data as private and confidential. It is stored securely and accessed only for fraud prevention and legal compliance purposes.

6. DATA SHARING
We do not sell your personal data. We share information only in the following limited circumstances:
- With the merchant partner fulfilling your order — your name, delivery address, and phone number are shared with the assigned merchant and rider solely to complete your delivery
- With Safaricom — your phone number is shared with Safaricom's Daraja API to initiate M-PESA payment requests
- With Cloudinary — product images and profile photos are stored on Cloudinary's servers (cloudinary.com)
- With our cloud hosting provider (Railway.app) — all platform data is hosted on Railway's infrastructure
- With Google — our maps functionality uses Google Maps APIs. Google's Privacy Policy applies to map interactions
- With Telegram — operational alerts are delivered via the Telegram Bot API. Order details relevant to the merchant or rider may be included in these alerts
- With law enforcement or regulatory authorities — where required by law or legal process

All third-party services we use are contractually required to handle your data in accordance with applicable data protection laws.

7. DATA RETENTION
- Account data: retained for as long as your account is active, plus 2 years after account deletion
- Order history: retained for 7 years to comply with Kenyan commercial and tax record-keeping requirements
- Age verification documents (ID scans): deleted within 90 days of verification completion
- Rider GPS pings: deleted within 30 days of the delivery they relate to
- Payment transaction records: retained for 7 years per Kenyan financial record-keeping requirements

8. YOUR RIGHTS
Under the Kenya Data Protection Act, 2019, you have the following rights:
- Right to access — request a copy of the personal data we hold about you
- Right to correction — request that inaccurate or incomplete data be corrected
- Right to deletion — request deletion of your personal data, subject to legal retention obligations
- Right to object — object to processing of your data in certain circumstances
- Right to data portability — request your data in a portable format
- Right to withdraw consent — where processing is based on consent, you may withdraw it at any time

To exercise any of these rights, contact us at support@s.tipsytheoryy.com. We will respond within 30 days.

<div id="deletion" className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
    <h2 className="text-xl font-black uppercase tracking-tight mb-4">Account & Data Deletion</h2>
    <p className="mb-4">Users can request the deletion of their account and all associated personal data by emailing our support team at <strong>support@s.tipsytheoryy.com</strong>. Please include "Account Deletion Request" in the subject line.</p>
    <p>Upon request, we will permanently delete your profile, contact information, and saved addresses within 30 days. Please note that some transaction records may be retained for up to 7 years to comply with Kenyan tax and financial regulations.</p>
</div>

9. SECURITY
We implement industry-standard security measures including encrypted data transmission (HTTPS/TLS), encrypted storage of sensitive credentials, access controls, and regular security reviews. No system is perfectly secure — if you suspect unauthorised access to your account, contact us immediately.

10. CHILDREN
Important: TipsyTheoryy is strictly for users aged 18 and over. We do not knowingly collect personal data from anyone under the age of 18. If we discover that a user is under 18, their account will be immediately suspended and their data deleted.

11. CHANGES TO THIS POLICY
We may update this Privacy Policy from time to time. We will notify you of material changes via the app or email at least 14 days before they take effect. Continued use of TipsyTheoryy after changes take effect constitutes your acceptance of the updated policy.

12. CONTACT
For privacy-related questions, data requests, or complaints, contact us at: support@s.tipsytheoryy.com
If you are not satisfied with our response, you have the right to lodge a complaint with the Office of the Data Protection Commissioner of Kenya.`}
                </div>

                {/* Plain Footer */}
                <div className="mt-20 pt-10 border-t border-slate-200 text-slate-400 text-xs text-center font-bold uppercase tracking-widest">
                    © 2026 TipsyTheoryy. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
