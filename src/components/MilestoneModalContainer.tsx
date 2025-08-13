import React from 'react';
import { useMilestone } from '../context/MilestoneContext';
import { TokenMilestoneModal } from './TokenMilestoneModal';

/**
 * MilestoneModalContainer - Renders the milestone modal when triggered
 * This component should be placed at the app root level to ensure modals appear correctly
 */
export function MilestoneModalContainer() {
  const { currentMilestone, isModalOpen, closeMilestone } = useMilestone();

  return (
    <TokenMilestoneModal
      milestone={currentMilestone}
      isOpen={isModalOpen}
      onClose={closeMilestone}
    />
  );
}
