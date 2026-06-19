module.exports = {
  ci: {
    collect: {
      startServerCommand: "node scripts/start-lhci-server.mjs",
      startServerReadyPattern: "Ready",
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/the-best-iot-sim-card/cloud-connect-sim-card/",
        "http://localhost:3000/dashcams/",
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox",
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["warn", { minScore: 0.75 }],
        "categories:best-practices": ["warn", { minScore: 0.85 }],
        "categories:seo": ["error", { minScore: 0.65 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
