import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Stethoscope, Calendar } from 'lucide-react';
import type { Test } from '../types';

export const PendingTests: React.FC = () => {
  const [tests] = useState<Test[]>([
    { id: 't1', testName: 'Complete Blood Count (CBC)', dueDate: 'Oct 12', status: 'pending' },
    { id: 't2', testName: 'Chest X-Ray', dueDate: 'Oct 14', status: 'scheduled' }
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Pending Medical Tests</h1>
      <p className="text-muted mb-6">Tests and diagnostics ordered by your clinician.</p>

      <div className="space-y-4">
        {tests.map(test => (
          <Card key={test.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{test.testName}</h3>
                <p className="text-sm text-muted flex items-center gap-1 mt-1">
                  <Calendar size={14} /> Due by: {test.dueDate}
                </p>
              </div>
            </div>
            <div>
              {test.status === 'scheduled' ? (
                <span className="text-sm font-semibold px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">Scheduled</span>
              ) : (
                <Button variant="secondary">Schedule Test</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
