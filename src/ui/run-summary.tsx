import { Box, Text } from 'ink';
import { FC } from 'react';

import type { MVPFlowResult } from '../workflow/mvp-runner.js';

export const RunSummary: FC<{ result: MVPFlowResult; verbose: boolean }> = ({
  result: { sessionId, platform, actionCount, reports },
  verbose
}) => (
  <Box flexDirection="column">
    <Text color="green">✔ Computer Doctor MVP flow completed</Text>
    <Text>Session: {sessionId}</Text>
    <Text>Platform adapter: {platform}</Text>
    <Text>Actions executed: {actionCount}</Text>
    {Object.entries(reports).map(([stage, reportPath]) => (
      <Text key={stage}>
        - {stage}: {reportPath}
      </Text>
    ))}
    {verbose && <Text color="yellow">Verbose mode enabled</Text>}
  </Box>
);
