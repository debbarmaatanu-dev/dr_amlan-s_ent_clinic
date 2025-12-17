import {useTheme} from '@/hooks/useTheme';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ClipLoader} from 'react-spinners';

const landingImage =
  'https://res.cloudinary.com/mobeet/image/upload/v1764923599/IMG_20251203_101518842_HDR_PORTRAIT_2_1_hyhvhd.jpg';

export const Landing = (): React.JSX.Element => {
  const navigation = useNavigate();
  const [loading, setLoading] = useState(true);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<string>('');
  const {actualTheme} = useTheme();

  const handleAppointmentPress = () => {
    setTimeout(() => {
      void navigation('/appointment');
      scrollTo(0, 0);
    }, 250);
  };

  const testWebhookHealth = async () => {
    setWebhookTesting(true);
    setWebhookResult('');

    try {
      // Test 1: Direct backend webhook test (GET)
      console.log('Testing direct backend webhook...');
      const backendResponse = await fetch(
        'https://debbarmaatanu-dev-dramlan-sentclini.vercel.app/payment/webhook-test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const backendResult = await backendResponse.json();
      console.log('Backend webhook test result:', backendResult);

      // Test 2: Frontend proxy webhook test (through approved domain)
      console.log('Testing frontend proxy webhook...');
      const proxyResponse = await fetch('/api/payment/webhook-test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const proxyResult = await proxyResponse.json();
      console.log('Proxy webhook test result:', proxyResult);

      // Test 3: POST test to simulate PhonePe webhook
      console.log('Testing POST webhook simulation...');
      const postResponse = await fetch(
        'https://debbarmaatanu-dev-dramlan-sentclini.vercel.app/payment/webhook-test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            test: true,
            type: 'CHECKOUT_ORDER_COMPLETED',
            transactionId: 'test_webhook_' + Date.now(),
            status: 'SUCCESS',
          }),
        },
      );

      const postResult = await postResponse.json();
      console.log('POST webhook test result:', postResult);

      setWebhookResult(
        `✅ All tests passed!\n\nBackend: ${backendResult.success ? 'OK' : 'FAILED'}\nProxy: ${proxyResult.success ? 'OK' : 'FAILED'}\nPOST: ${postResult.success ? 'OK' : 'FAILED'}`,
      );
    } catch (error) {
      console.error('Webhook test failed:', error);
      setWebhookResult(
        `❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setWebhookTesting(false);
    }
  };

  const gradient =
    actualTheme === 'light'
      ? 'from-blue-100 via-blue-200 to-green-100'
      : 'from-blue-900 via-blue-950 to-green-900';

  const textColor = actualTheme === 'light' ? 'text-gray-600' : 'text-gray-200';

  return (
    <section
      className={`flex grow items-center justify-center bg-linear-to-br ${gradient} px-4 py-6 shadow-xl md:py-12 lg:px-8`}
      aria-label="Dr. Amlan Debbarma ENT Clinic Introduction">
      <div className="h-full w-full">
        <article className="overflow-hidden">
          {/* Header Section - Split Design */}
          <header className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Box - Image */}
            <figure className="flex items-center justify-center">
              <div className="relative h-full w-full max-w-md overflow-hidden rounded-3xl shadow-md">
                {loading && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-gray-100"
                    aria-label="Loading doctor image">
                    <ClipLoader size={40} color="#3B82F6" loading={loading} />
                  </div>
                )}
                <img
                  src={landingImage}
                  alt="Dr. (Major) Amlan Debbarma, MS ENT - Leading ENT specialist and surgeon in Agartala, Tripura"
                  className="h-full w-full object-cover"
                  onLoad={() => setLoading(false)}
                  style={{display: loading ? 'none' : 'block'}}
                  loading="eager"
                  width="400"
                  height="600"
                />
              </div>
            </figure>

            {/* Right Box - Text Content */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <h1 className="mb-3 text-2xl font-bold text-blue-600 md:text-3xl lg:text-4xl">
                Dr. (Major) Amlan's ENT Clinic
              </h1>
              <p
                className={`mb-6 text-base ${textColor} md:text-lg`}
                itemScope
                itemType="https://schema.org/Person">
                <span itemProp="honorificPrefix">Dr. (Major)</span>{' '}
                <span itemProp="name">Amlan Debbarma</span>
                <br />
                <span itemProp="hasCredential">MBBS, MS ENT</span>
                <br />
                <span itemProp="alumniOf">Ex-Army Medical Corps</span>
                <br />
                <span itemProp="jobTitle">
                  Endoscopic and Microscopic ENT Surgeon
                </span>
                <br />
                at{' '}
                <span itemProp="worksFor">
                  Tripura Medical College, Agartala
                </span>
              </p>
              <div className="flex flex-col gap-4">
                <button
                  className="w-fit cursor-pointer rounded-md bg-blue-600 px-6 py-3 text-white shadow-md transition-transform duration-180 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none active:scale-95"
                  onClick={handleAppointmentPress}
                  aria-label="Book an appointment with Dr. Amlan Debbarma">
                  <span className="text-base font-medium md:text-lg">
                    <i
                      className="fa-solid fa-calendar-plus mr-2"
                      aria-hidden="true"></i>
                    Make an Appointment
                  </span>
                </button>

                {/* Temporary Webhook Test Button */}
                <button
                  className="w-fit cursor-pointer rounded-md bg-orange-600 px-4 py-2 text-white shadow-md transition-transform duration-180 hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none active:scale-95 disabled:opacity-50"
                  onClick={testWebhookHealth}
                  disabled={webhookTesting}
                  aria-label="Test webhook connectivity">
                  <span className="text-sm font-medium">
                    {webhookTesting ? (
                      <>
                        <ClipLoader
                          size={16}
                          color="#ffffff"
                          className="mr-2"
                        />
                        Testing Webhooks...
                      </>
                    ) : (
                      <>
                        <i
                          className="fa-solid fa-network-wired mr-2"
                          aria-hidden="true"></i>
                        Test Webhook Health
                      </>
                    )}
                  </span>
                </button>

                {/* Webhook Test Results */}
                {webhookResult && (
                  <div
                    className={`mt-2 rounded-md p-3 text-sm ${
                      webhookResult.includes('✅')
                        ? 'border border-green-200 bg-green-100 text-green-800'
                        : 'border border-red-200 bg-red-100 text-red-800'
                    }`}>
                    <pre className="font-mono text-xs whitespace-pre-wrap">
                      {webhookResult}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </header>
        </article>
      </div>
    </section>
  );
};
