'use client';

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Trash2, Edit2, ShieldCheck } from "lucide-react";

export default function AdminUsers() {
  const users = [
    { id: 1, name: "Jane Doe", role: "Patient", email: "jane@example.com", status: "Active" },
    { id: 2, name: "Pharma Health", role: "Pharmacy", email: "pharma@pharmahealth.com", status: "Pending" },
    { id: 3, name: "John Admin", role: "Admin", email: "john@admin.com", status: "Active" },
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">👥 User Management</h1>

      <Card className="shadow-xl border rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="text-blue-600" /> Users List
            </h2>
            <Button className="bg-green-600 hover:bg-green-700">Add New User</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="outline">
                      <Edit2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                    </Button>
                    <Button size="icon" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
