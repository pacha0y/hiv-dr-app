'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import Layout from '../components/Layout';

import { Application } from '@/types/Application'; // Adjust this path as needed

const statusOptions = [
  'New',
  'Pending review',
  'Approved',
  'Sample Collected',
  'Results Received',
  'Completed',
  'Rejected',
];

const ApplicationsPage = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [assigningAppIndex, setAssigningAppIndex] = useState<number | null>(
    null
  );
  const [selectedReviewers, setSelectedReviewers] = useState<number[]>([]);
  const [leadReviewer, setLeadReviewer] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('New');

  const [reviewers, setReviewers] = useState<
    { id: number; title: string; first_name: string; last_name: string }[]
  >([]);

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/experts');
        if (!res.ok) throw new Error('Failed to fetch reviewers');
        const data = await res.json();
        setReviewers(data);
      } catch (error) {
        console.error(error);
        setReviewers([]);
      }
    };
    fetchReviewers();
  }, []);

  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/applications');
        if (!res.ok) throw new Error('Failed to fetch applications');
        const data = await res.json();
        const apps = data.map(
          (app: { statuses: { status: string; startDate: string }[] }) => {
            const status =
              app.statuses?.sort(
                (a, b) =>
                  new Date(b.startDate).getTime() -
                  new Date(a.startDate).getTime()
              )[0]?.status || 'Unknown';
            return {
              ...app,
              status,
            };
          }
        );
        console.log('Fetched applications:', apps);
        setApplications(apps);
      } catch (error) {
        console.error(error);
        setApplications([]); // fallback to empty array
      }
    };
    fetchApplications();
  }, []);

  const toggleReviewer = (id: number) => {
    setSelectedReviewers((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const toggleDetails = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const openAssignModal = (index: number) => {
    setAssigningAppIndex(index);
    setSelectedReviewers([]);
    setLeadReviewer(null);
  };

  const closeModal = () => {
    setAssigningAppIndex(null);
  };

  const handleAssign = async () => {
    if (selectedReviewers.length < 2) {
      alert('Select at least 2 reviewers.');
      return;
    }
    if (!leadReviewer) {
      alert('Select one lead reviewer.');
      return;
    }
    if (!selectedReviewers.includes(leadReviewer)) {
      alert('Lead reviewer must be one of the selected reviewers.');
      return;
    }

    try {
      const application = filteredApps[assigningAppIndex!];

      // Loop through selected reviewers and send a POST for each
      for (const reviewerId of selectedReviewers) {
        const payload = {
          applicationId: application.id,
          reviewerId: reviewerId,
          is_lead: reviewerId === leadReviewer,
          comment: '', // You can add a comment input if needed
          review_status: 'pending',
        };

        const res = await fetch('http://127.0.0.1:8000/applications/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`Failed to assign reviewer ${reviewerId}`);
        }
      }

      alert('Reviewers assigned successfully!');
      closeModal();
    } catch (error) {
      console.error(error);
      alert('Error assigning reviewers.');
    }
  };

  const filteredApps = applications.filter(
    (app) => app.status === selectedStatus.toLowerCase()
  );
  return (
    <Layout>
      <div className='p-6'>
        <div className='border-b border-gray-300 mb-6'>
          <nav className='flex space-x-4 -mb-px'>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`whitespace-nowrap px-4 py-2 font-medium border-b-2 transition-colors duration-200 ${
                  selectedStatus === status
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </nav>
        </div>
        <ul className='space-y-4'>
          {filteredApps.length === 0 ? (
            <p className='text-gray-500'>
              No applications in "{selectedStatus}"
            </p>
          ) : (
            filteredApps.map((app, index) => (
              <li
                key={index}
                className='border border-gray-300 rounded shadow-sm p-4 bg-white'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-medium'>
                      {app.patientFirstName} {app.patientLastName} ({app.sex}){' '}
                      {app.age} - ({app.status})
                    </p>
                    <p className='text-sm text-gray-600'>
                      ART #: {app.artRegNo} | Facility: {app.facilityName}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleDetails(index)}
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm'
                  >
                    {expandedIndex === index ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>

                {expandedIndex === index && (
                  <div className='mt-4 border-t pt-4 text-sm space-y-2'>
                    <p>
                      <strong>CD4:</strong> {app.cd4} ({app.cd4Date})
                    </p>
                    <div>
                      <strong>VL History:</strong>
                      <ul className='list-disc ml-6 mt-1'>
                        {app.vlHistory.map(
                          (
                            vl: {
                              sampleDate: string;
                              result: string;
                              reason: string;
                            },
                            idx: number
                          ) => (
                            <li key={idx}>
                              {vl.sampleDate}: {vl.result} ({vl.reason})
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div>
                      <strong>Clinical Status:</strong>
                      <ul className='list-disc ml-6 mt-1'>
                        {Object.entries(app.clinicalStatus)
                          .filter(
                            ([_, item]) =>
                              (item as { checked: boolean }).checked
                          )
                          .map(([key, item], idx) => (
                            <li key={idx}>
                              {key}:{' '}
                              {(item as { date: string; details: string }).date}{' '}
                              –{' '}
                              {
                                (item as { date: string; details: string })
                                  .details
                              }
                            </li>
                          ))}
                      </ul>
                    </div>
                    {selectedStatus.toLowerCase() === 'new' && (
                      <div className='mt-4 flex gap-2'>
                        <button
                          onClick={() => openAssignModal(index)}
                          className='bg-green-600 text-white px-3 py-1 rounded text-sm'
                        >
                          Assign Reviewers
                        </button>
                      </div>
                    )}
                    <Link
                      href={`/applications/${app.id}`}
                      className='bg-blue-600 text-white px-3 py-1 rounded text-sm'
                    >
                      See More
                    </Link>
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Modal */}
      {assigningAppIndex !== null && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]'>
          {/* Modal panel */}
          <div className='bg-white backdrop-blur-md w-full max-w-md mx-auto p-6 rounded-lg shadow-xl border border-white/40'>
            <h2 className='text-lg font-semibold mb-4'>Assign Reviewers</h2>
            <div className='mb-4'>
              <input
                id='reviewer-search'
                type='text'
                className='w-full px-3 py-2 mb-3 border rounded'
                placeholder='Search reviewers...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className='overflow-y-auto max-h-60 border rounded p-2 bg-white/80'>
                {reviewers.map((reviewer) => (
                  <div
                    key={reviewer.id}
                    className='flex items-center justify-between py-1'
                  >
                    <label className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        checked={selectedReviewers.includes(reviewer.id)}
                        onChange={() => toggleReviewer(reviewer.id)}
                      />
                      {reviewer.title} {reviewer.first_name}{' '}
                      {reviewer.last_name}
                    </label>

                    <button
                      className='text-sm text-blue-600 underline'
                      onClick={() => setLeadReviewer(reviewer.id)}
                    >
                      {leadReviewer === reviewer.id
                        ? 'Lead Reviewer ✅'
                        : 'Set as Lead'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-4 flex justify-end gap-2'>
              <button
                onClick={closeModal}
                className='px-3 py-1 rounded bg-gray-300 text-sm'
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className='px-4 py-1 rounded bg-blue-600 text-white text-sm'
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ApplicationsPage;
