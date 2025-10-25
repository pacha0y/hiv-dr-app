"use client";

import { Badge, Spinner,Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from "flowbite-react";
import { useEffect, useState } from "react";

import Layout from "../components/Layout";

interface Expert {
  id: number;
  title: string;
  first_name: string;
  last_name: string;
  institution: string;
  position: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_lead: boolean;
  creator: string;
}

export default function ExpertsPage() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExperts() {
      try {
        const res = await fetch("http://localhost:8000/experts"); // Change to your API
        if (!res.ok) throw new Error("Failed to fetch experts");
        const data = await res.json();
        setExperts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchExperts();
  }, []);

  return (
    <Layout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Experts List</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner size="xl" />
        </div>
      ) : experts.length === 0 ? (
        <p className="text-gray-500">No experts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table hoverable={true}>
            <TableHead>
              <TableHeadCell>Title</TableHeadCell>
              <TableHeadCell>First Name</TableHeadCell>
              <TableHeadCell>Last Name</TableHeadCell>
              <TableHeadCell>Institution</TableHeadCell>
              <TableHeadCell>Position</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Phone</TableHeadCell>
              <TableHeadCell>Active</TableHeadCell>
              <TableHeadCell>Lead</TableHeadCell>
              <TableHeadCell>Creator</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {experts.map((expert) => (
                <TableRow
                  key={expert.id}
                  className="bg-white"
                >
                  <TableCell>{expert.title}</TableCell>
                  <TableCell>{expert.first_name}</TableCell>
                  <TableCell>{expert.last_name}</TableCell>
                  <TableCell>{expert.institution}</TableCell>
                  <TableCell>{expert.position}</TableCell>
                  <TableCell>{expert.email}</TableCell>
                  <TableCell>{expert.phone}</TableCell>
                  <TableCell>
                    {expert.is_active ? (
                      <Badge color="success">Yes</Badge>
                    ) : (
                      <Badge color="failure">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {expert.is_lead ? (
                      <Badge color="info">Yes</Badge>
                    ) : (
                      <Badge color="gray">No</Badge>
                    )}
                  </TableCell>
                  <TableCell>{expert.creator}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
    </Layout>
  );
}
