// Vercel Edge API for mobile app update checks
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { currentVersion, platform } = await req.json();

    console.log(`📱 Update check from ${platform} - Current version: ${currentVersion}`);

    // Get latest build info from your deployment
    const latestVersion = await getLatestVersion();
    const buildInfo = await getBuildInfo();

    const hasUpdate = currentVersion !== latestVersion;

    const response = {
      version: latestVersion,
      buildTime: buildInfo.buildTime,
      downloadUrl: hasUpdate ? `${new URL(req.url).origin}/api/mobile-update-download` : '',
      size: buildInfo.size,
      mandatory: false, // Set to true for critical updates
      hasUpdate
    };

    console.log(`🔍 Update check result: ${hasUpdate ? 'Update available' : 'Up to date'}`);

    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Update check failed:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

async function getLatestVersion(): Promise<string> {
  // Use build timestamp or git commit as version
  const buildTime = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 8) ||
    new Date().toISOString().substring(0, 19).replace(/[-:T]/g, '');
  return buildTime;
}

async function getBuildInfo() {
  // Calculate approximate bundle size from static files
  const baseSize = 2 * 1024 * 1024; // 2MB estimated base size

  return {
    buildTime: new Date().toISOString(),
    size: baseSize
  };
}