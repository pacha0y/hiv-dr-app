'use client';

import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Alert,
  Badge,
  Button,
  Card,
  Label,
  Radio,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi';

import Layout from '../../components/Layout';

interface Application {
  id: number;
  patientFirstName: string;
  patientLastName: string;
  age: number;
  sex: string;
  facilityName: string;
  artRegNo: string;
  status: string;
  clinicalStatus: Record<
    string,
    { checked: boolean; date?: string; details?: string }
  >;
  hb: string;
  hbDate: string;
  cd4: string;
  cd4Date: string;
  creatinine: string;
  creatinineDate: string;
  alt: string;
  altDate: string;
  bilirubin: string;
  bilirubinDate: string;
  hepB: string;
  hepBDate: string;
  lam: string;
  lamDate: string;
  crag: string;
  cragDate: string;
  vlHistory: Array<{ reason: string; result: string; sampleDate: string }>;
  artHistory: Array<{
    regimen: string;
    startDate: string;
    stopDate: string;
    reason: string;
  }>;
  tbHistory: Array<{
    tbRegimen: string;
    startDate: string;
    stopDate: string;
    artRegimen: string;
  }>;
  otherDrugs: Array<{ drug: string; startDate: string; stopDate: string }>;
}

export default function ReviewApplicationPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState<'approve' | 'reject' | ''>('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch('http://localhost:8000/applications/1');
        if (!res.ok) throw new Error('Failed to fetch application');
        const data = await res.json();
        setApplication(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplication();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) {
      alert('Please select a decision');
      return;
    }

    const payload = {
      applicationId: application?.id,
      comment,
      review_status: decision,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit review');

      setSubmitted(true);
      setComment('');
      setDecision('');
    } catch (error) {
      console.error(error);
      alert('Error submitting review');
    }
  };

  const DataTable = ({
    headers,
    rows,
  }: {
    headers: string[];
    rows: (string | number | null | undefined)[][];
  }) => (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((h) => (
            <TableHeadCell key={h}>{h}</TableHeadCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            {row.map((cell, i) => (
              <TableCell key={i}>{cell ?? '-'}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (loading) {
    return (
      <Layout>
        <div className='flex justify-center items-center h-40'>
          <Spinner size='xl' />
        </div>
      </Layout>
    );
  }

  if (!application) {
    return (
      <Layout>
        <p className='text-gray-500 p-6'>No application found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='max-w-5xl mx-auto p-6 space-y-6'>
        {submitted && (
          <Alert
            color='success'
            icon={HiInformationCircle}
            onDismiss={() => alert('Alert dismissed!')}
          >
            Review has successfully been submitted.
          </Alert>
        )}
        ;
        <Card>
          <h2 className='text-xl font-semibold'>Patient Information</h2>
          <div className='grid grid-cols-2 gap-4 mt-4'>
            <p>
              <span className='font-medium'>Name:</span>{' '}
              {application.patientFirstName} {application.patientLastName}
            </p>
            <p>
              <span className='font-medium'>Age:</span> {application.age}
            </p>
            <p>
              <span className='font-medium'>Sex:</span> {application.sex}
            </p>
            <p>
              <span className='font-medium'>Facility:</span>{' '}
              {application.facilityName}
            </p>
            <p>
              <span className='font-medium'>ART Reg No:</span>{' '}
              {application.artRegNo}
            </p>
            <p>
              <span className='font-medium'>Status:</span>{' '}
              <Badge color='info'>{application.status}</Badge>
            </p>
          </div>
        </Card>
        <Accordion>
          <AccordionPanel>
            <AccordionTitle>Clinical Status</AccordionTitle>
            <AccordionContent>
              <DataTable
                headers={['Condition', 'Checked', 'Date', 'Details']}
                rows={Object.entries(application.clinicalStatus).map(
                  ([key, val]: [
                    string,
                    { checked: boolean; date?: string; details?: string }
                  ]) => [key, val.checked ? 'Yes' : 'No', val.date, val.details]
                )}
              />
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel>
            <AccordionTitle>Lab Results</AccordionTitle>
            <AccordionContent>
              <div className='grid grid-cols-2 gap-4'>
                {[
                  ['HB', application.hb, application.hbDate],
                  ['CD4', application.cd4, application.cd4Date],
                  [
                    'Creatinine',
                    application.creatinine,
                    application.creatinineDate,
                  ],
                  ['ALT', application.alt, application.altDate],
                  [
                    'Bilirubin',
                    application.bilirubin,
                    application.bilirubinDate,
                  ],
                  ['HepB', application.hepB, application.hepBDate],
                  ['LAM', application.lam, application.lamDate],
                  ['CRAG', application.crag, application.cragDate],
                ].map(([label, value, date]) => (
                  <p key={label}>
                    <b>{label}:</b> {value} ({date})
                  </p>
                ))}
              </div>
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel>
            <AccordionTitle>Viral Load History</AccordionTitle>
            <AccordionContent>
              <DataTable
                headers={['Reason', 'Result', 'Sample Date']}
                rows={application.vlHistory.map(
                  (vl: {
                    reason: string;
                    result: string;
                    sampleDate: string;
                  }) => [vl.reason, vl.result, vl.sampleDate]
                )}
              />
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel>
            <AccordionTitle>ART History</AccordionTitle>
            <AccordionContent>
              <DataTable
                headers={['Regimen', 'Start Date', 'Stop Date', 'Reason']}
                rows={application.artHistory.map((art) => [
                  art.regimen,
                  art.startDate,
                  art.stopDate,
                  art.reason,
                ])}
              />
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel>
            <AccordionTitle>TB History</AccordionTitle>
            <AccordionContent>
              <DataTable
                headers={[
                  'TB Regimen',
                  'Start Date',
                  'Stop Date',
                  'ART Regimen',
                ]}
                rows={application.tbHistory.map(
                  (tb: {
                    tbRegimen: string;
                    startDate: string;
                    stopDate: string;
                    artRegimen: string;
                  }) => [tb.tbRegimen, tb.startDate, tb.stopDate, tb.artRegimen]
                )}
              />
            </AccordionContent>
          </AccordionPanel>

          <AccordionPanel>
            <AccordionTitle>Other Drugs</AccordionTitle>
            <AccordionContent>
              <DataTable
                headers={['Drug', 'Start Date', 'Stop Date']}
                rows={application.otherDrugs.map(
                  (d: {
                    drug: string;
                    startDate: string;
                    stopDate: string;
                  }) => [d.drug, d.startDate, d.stopDate]
                )}
              />
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
        <Card>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='comment'>Your Comment</Label>
              <Textarea
                id='comment'
                placeholder='Write your review comment...'
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div>
              <Label>Decision</Label>
              <div className='flex items-center gap-4 mt-2'>
                {['approve', 'reject'].map((opt) => (
                  <div key={opt} className='flex items-center gap-2'>
                    <Radio
                      id={opt}
                      name='decision'
                      value={opt}
                      checked={decision === opt}
                      onChange={() => setDecision(opt as 'approve' | 'reject')}
                    />
                    <Label htmlFor={opt} className='capitalize'>
                      {opt}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type='submit' color='blue'>
              Submit Review
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
