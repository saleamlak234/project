// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { 
//   TrendingUp, 
//   DollarSign, 
//   Users, 
//   Award,
//   CheckCircle,
//   ArrowRight,
//   Star,
//   Shield,
//   Target,
//   Zap
// } from 'lucide-react';

// export default function Home() {
//   const { user } = useAuth();

//   const features = [
//     {
//       icon: DollarSign,
//       title: 'High Returns',
//       description: '20% monthly returns on all investment packages',
//       color: 'text-green-600'
//     },
//     {
//       icon: Users,
//       title: 'MLM System',
//       description: 'Earn 15% commission from referrals (8%, 4%, 2%, 1%)',
//       color: 'text-blue-600'
//     },
//     {
//       icon: Shield,
//       title: 'Secure Platform',
//       description: 'Advanced security measures to protect your investments',
//       color: 'text-purple-600'
//     },
//     {
//       icon: Zap,
//       title: 'Instant Payouts',
//       description: 'Quick withdrawal processing with multiple payment options',
//       color: 'text-orange-600'
//     }
//   ];

//   const packages = [
//     {
//       name: 'Full Stock Package',
//       price: 70000,
//       monthlyReturn: 14000,
//       quarterlyWithdraw: true,
//       popular: true
//     },
//     {
//       name: 'Half Stock Package',
//       price: 35000,
//       monthlyReturn: 7000,
//       quarterlyWithdraw: true,
//       popular: false
//     },
//     {
//       name: 'Quarter Stock Package',
//       price: 17500,
//       monthlyReturn: 3500,
//       quarterlyWithdraw: true,
//       popular: false
//     },
//     {
//       name: 'Minimum Stock Package',
//       price: 7000,
//       monthlyReturn: 1400,
//       quarterlyWithdraw: true,
//       popular: false
//     }
//   ];

//   return (
//     <div className="min-h-screen">
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
//               Welcome to <span className="text-gold-400">Saham Trading</span>
//             </h1>
//             <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
//               Join Ethiopia's leading stock market investment platform with guaranteed returns 
//               and powerful MLM earning opportunities
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
//               {!user ? (
//                 <>
//                   <Link
//                     to="/register"
//                     className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center space-x-2"
//                   >
//                     <span>Start Investing Today</span>
//                     <ArrowRight className="h-5 w-5" />
//                   </Link>
//                   <Link
//                     to="/login"
//                     className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
//                   >
//                     Login
//                   </Link>
//                 </>
//               ) : (
//                 <Link
//                   to="/dashboard"
//                   className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center space-x-2"
//                 >
//                   <span>Go to Dashboard</span>
//                   <ArrowRight className="h-5 w-5" />
//                 </Link>
//               )}
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-gold-400 mb-2">20%</div>
//                 <div className="text-primary-200">Monthly Returns</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-gold-400 mb-2">15%</div>
//                 <div className="text-primary-200">Referral Commission</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-gold-400 mb-2">1000+</div>
//                 <div className="text-primary-200">Active Investors</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Why Choose Saham Trading?
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               We offer the most comprehensive investment platform with guaranteed returns 
//               and multiple earning opportunities
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {features.map((feature, index) => {
//               const IconComponent = feature.icon;
//               return (
//                 <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
//                   <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ${feature.color} mb-4 group-hover:bg-primary-50`}>
//                     <IconComponent className="h-8 w-8" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.description}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Investment Packages */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Investment Packages
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Choose the package that fits your investment goals. All packages offer 20% monthly returns
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {packages.map((pkg, index) => (
//               <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 ${pkg.popular ? 'border-gold-400' : 'border-gray-200'}`}>
//                 {pkg.popular && (
//                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                     <span className="bg-gold-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
//                       Most Popular
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="text-center">
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
//                   <div className="text-3xl font-bold text-primary-600 mb-1">
//                     {pkg.price.toLocaleString()} ETB
//                   </div>
//                   <div className="text-sm text-gray-500 mb-6">Initial Investment</div>
                  
//                   <div className="space-y-3 mb-6">
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Monthly Return:</span>
//                       <span className="font-semibold text-green-600">
//                         {pkg.monthlyReturn.toLocaleString()} ETB
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Return Rate:</span>
//                       <span className="font-semibold text-green-600">20%</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-gray-600">Withdrawals:</span>
//                       <span className="font-semibold text-blue-600">Quarterly</span>
//                     </div>
//                   </div>

//                   <ul className="space-y-2 mb-6">
//                     <li className="flex items-center text-sm text-gray-600">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                       20% Monthly Returns
//                     </li>
//                     <li className="flex items-center text-sm text-gray-600">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                       Quarterly Withdrawals
//                     </li>
//                     <li className="flex items-center text-sm text-gray-600">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                       MLM Commission Eligible
//                     </li>
//                     <li className="flex items-center text-sm text-gray-600">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                       24/7 Support
//                     </li>
//                   </ul>

//                   {!user ? (
//                     <Link
//                       to="/register"
//                       className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
//                         pkg.popular
//                           ? 'bg-gold-500 hover:bg-gold-600 text-black'
//                           : 'bg-primary-600 hover:bg-primary-700 text-white'
//                       }`}
//                     >
//                       Get Started
//                     </Link>
//                   ) : (
//                     <Link
//                       to="/deposits"
//                       className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
//                         pkg.popular
//                           ? 'bg-gold-500 hover:bg-gold-600 text-black'
//                           : 'bg-primary-600 hover:bg-primary-700 text-white'
//                       }`}
//                     >
//                       Invest Now
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* MLM Commission Structure */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               MLM Commission Structure
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Earn from every person you refer and their referrals too. 
//               Build your network and maximize your earnings.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div className="text-center">
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 mb-4">
//                 <div className="text-3xl font-bold mb-2">8%</div>
//                 <div className="text-blue-100">Level 1</div>
//               </div>
//               <h3 className="font-semibold text-gray-900">Direct Referrals</h3>
//               <p className="text-gray-600 text-sm">People you directly invite</p>
//             </div>

//             <div className="text-center">
//               <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 mb-4">
//                 <div className="text-3xl font-bold mb-2">4%</div>
//                 <div className="text-green-100">Level 2</div>
//               </div>
//               <h3 className="font-semibold text-gray-900">2nd Level</h3>
//               <p className="text-gray-600 text-sm">People your referrals invite</p>
//             </div>

//             <div className="text-center">
//               <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 mb-4">
//                 <div className="text-3xl font-bold mb-2">2%</div>
//                 <div className="text-purple-100">Level 3</div>
//               </div>
//               <h3 className="font-semibold text-gray-900">3rd Level</h3>
//               <p className="text-gray-600 text-sm">Third level down your chain</p>
//             </div>

//             <div className="text-center">
//               <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 mb-4">
//                 <div className="text-3xl font-bold mb-2">1%</div>
//                 <div className="text-orange-100">Level 4</div>
//               </div>
//               <h3 className="font-semibold text-gray-900">4th Level</h3>
//               <p className="text-gray-600 text-sm">Fourth level down your chain</p>
//             </div>
//           </div>

//           <div className="text-center mt-12">
//             <div className="bg-gradient-to-r from-gold-100 to-gold-50 rounded-2xl p-8 max-w-2xl mx-auto">
//               <Award className="h-12 w-12 text-gold-600 mx-auto mb-4" />
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Commission: 15%</h3>
//               <p className="text-gray-600">
//                 Every time someone in your network makes a deposit or earns, 
//                 you get your share of the commission automatically.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-4">
//             Ready to Start Building Wealth?
//           </h2>
//           <p className="text-xl mb-8 text-primary-100">
//             Join thousands of successful investors who are already earning with Saham Trading. 
//             Start with any package and begin your journey to financial freedom.
//           </p>
          
//           {!user ? (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link
//                 to="/register"
//                 className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
//               >
//                 <span>Start Investing Now</span>
//                 <ArrowRight className="h-5 w-5" />
//               </Link>
//               <Link
//                 to="/login"
//                 className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
//               >
//                 Login to Account
//               </Link>
//             </div>
//           ) : (
//             <Link
//               to="/dashboard"
//               className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
//             >
//               <span>View Your Dashboard</span>
//               <ArrowRight className="h-5 w-5" />
//             </Link>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  Star,
  Shield,
  Target,
  Zap
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const features = [
    {
      icon: DollarSign,
      titleKey: 'highReturns',
      descriptionKey: 'highReturnsDescription', // Add description keys
      color: 'text-green-600'
    },
    {
      icon: Users,
      titleKey: 'mlmSystem',
      descriptionKey: 'mlmSystemDescription',
      color: 'text-blue-600'
    },
    {
      icon: Shield,
      titleKey: 'securePlatform',
      descriptionKey: 'securePlatformDescription',
      color: 'text-purple-600'
    },
    {
      icon: Zap,
      titleKey: 'instantPayouts',
      descriptionKey: 'instantPayoutsDescription',
      color: 'text-orange-600'
    }
  ];

  const packages = [
    {
      nameKey: '7th package',
      price: 192000,
      // monthlyReturn: 14000,
      // quarterlyWithdraw: true,
      popular: true
    },
    {
      nameKey: '6th package',
      price: 96000,
      // monthlyReturn: 7000,
      // quarterlyWithdraw: true,
      popular: false
    },
    {
      nameKey: '5th package',
      price: 48000,
      // monthlyReturn: 3500,
      // quarterlyWithdraw: true,
      popular: false
    },
    {
      nameKey: '4th package',
      price: 24000,
      // monthlyReturn: 1400,
      // quarterlyWithdraw: true,
      popular: false
    },
    {
      nameKey: '3rd package',
      price: 12000,
      // monthlyReturn: 1400,
      // quarterlyWithdraw: true,
      popular: false
    },
    {
      nameKey: '2nd package',
      price: 6000,
      // monthlyReturn: 1400,
      // quarterlyWithdraw: true,
      popular: false
    },
    {
      nameKey: '1st package',
      price: 3000,
      // monthlyReturn: 1400,
      // quarterlyWithdraw: true,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <LanguageSwitcher /> 
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('welcome')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-up">
              Join Ethiopia's leading stock market investment platform with guaranteed returns 
              and powerful MLM earning opportunities
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!user ? (
                <>
                  <Link
                    to="/register"
                    className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center space-x-2"
                  >
                    <span>{t('startInvestingToday')}</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                  >
                    {t('login')}
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <span>View Your Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">20%</div>
                <div className="text-primary-200">Monthly Returns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">15%</div>
                <div className="text-primary-200">Referral Commission</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold-400 mb-2">1000+</div>
                <div className="text-primary-200">Active Investors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer the most comprehensive investment platform with guaranteed returns 
              and multiple earning opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 ${feature.color} mb-4 group-hover:bg-primary-50`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{t(feature.titleKey)}</h3>
                  <p className="text-gray-600">{feature.descriptionKey}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Investment Packages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('investmentPackages')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the package that fits your investment goals. All packages offer 20% monthly returns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 hover:shadow-xl hover:transform hover:scale-105 ${pkg.popular ? 'border-gold-400' : 'border-gray-200'}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gold-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t(pkg.nameKey)}</h3>
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {pkg.price.toLocaleString()} ETB
                  </div>
                  <div className="text-sm text-gray-500 mb-6">Initial Investment</div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Monthly Return:</span>
                      {/* <span className="font-semibold text-green-600">
                        {pkg.monthlyReturn.toLocaleString()} ETB
                      </span> */}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Return Rate:</span>
                      <span className="font-semibold text-green-600">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Withdrawals:</span>
                      <span className="font-semibold text-blue-600">daily</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      15% daily Returns
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      daily Withdrawals
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      MLM Commission Eligible
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      24/7 Support
                    </li>
                  </ul>

                  {!user ? (
                    <Link
                      to="/register"
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        pkg.popular
                          ? 'bg-gold-500 hover:bg-gold-600 text-black'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      Get Started
                    </Link>
                  ) : (
                    <Link
                      to="/deposits"
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        pkg.popular
                          ? 'bg-gold-500 hover:bg-gold-600 text-black'
                          : 'bg-primary-600 hover:bg-primary-700 text-white'
                      }`}
                    >
                      Invest Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MLM Commission Structure */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('mlmCommissionStructure')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn from every person you refer and their referrals too. 
              Build your network and maximize your earnings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 mb-4">
                <div className="text-3xl font-bold mb-2">8%</div>
                <div className="text-blue-100">Level 1</div>
              </div>
              <h3 className="font-semibold text-gray-900">Direct Referrals</h3>
              <p className="text-gray-600 text-sm">People you directly invite</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 mb-4">
                <div className="text-3xl font-bold mb-2">4%</div>
                <div className="text-green-100">Level 2</div>
              </div>
              <h3 className="font-semibold text-gray-900">2nd Level</h3>
              <p className="text-gray-600 text-sm">People your referrals invite</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 mb-4">
                <div className="text-3xl font-bold mb-2">2%</div>
                <div className="text-purple-100">Level 3</div>
              </div>
              <h3 className="font-semibold text-gray-900">3rd Level</h3>
              <p className="text-gray-600 text-sm">Third level down your chain</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 mb-4">
                <div className="text-3xl font-bold mb-2">1%</div>
                <div className="text-orange-100">Level 4</div>
              </div>
              <h3 className="font-semibold text-gray-900">4th Level</h3>
              <p className="text-gray-600 text-sm">Fourth level down your chain</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-gold-100 to-gold-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <Award className="h-12 w-12 text-gold-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Total Commission: 15%</h3>
              <p className="text-gray-600">
                Every time someone in your network makes a deposit or earns, 
                you get your share of the commission automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('readyToStart')}
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of successful investors who are already earning with Saham Trading. 
            Start with any package and begin your journey to financial freedom.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{t('startInvestingNow')}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                {t('loginToAccount')}
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>{t('viewYourDashboard')}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}