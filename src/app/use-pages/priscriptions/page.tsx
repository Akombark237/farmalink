"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    Download,
    File,
    FileText,
    PlusCircle,
    Trash2,
    Upload,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock data for prescriptions
const mockPrescriptions = [
  {
    id: "1",
    name: "Amoxicillin",
    doctor: "Dr. Sarah Johnson",
    hospital: "Metro General Hospital",
    date: new Date(2025, 4, 15),
    status: "active",
    expiryDate: new Date(2025, 7, 15),
    refillsLeft: 2,
    totalRefills: 3,
    notes: "Take 3 times daily with meals. Finish the entire course.",
    imageUrl: "/api/placeholder/400/320"
  },
  {
    id: "2",
    name: "Lisinopril",
    doctor: "Dr. Michael Chen",
    hospital: "Riverdale Medical Center",
    date: new Date(2025, 3, 10),
    status: "active",
    expiryDate: new Date(2025, 9, 10),
    refillsLeft: 5,
    totalRefills: 5,
    notes: "Take once daily in the morning with or without food.",
    imageUrl: "/api/placeholder/400/320"
  },
  {
    id: "3",
    name: "Metformin",
    doctor: "Dr. Emily Rodriguez",
    hospital: "Sunshine Community Clinic",
    date: new Date(2025, 2, 25),
    status: "expired",
    expiryDate: new Date(2025, 4, 10),
    refillsLeft: 0,
    totalRefills: 2,
    notes: "Take with meals to reduce stomach upset.",
    imageUrl: "/api/placeholder/400/320"
  },
  {
    id: "4",
    name: "Atorvastatin",
    doctor: "Dr. James Wilson",
    hospital: "Heart & Vascular Center",
    date: new Date(2025, 4, 5),
    status: "pending",
    expiryDate: new Date(2025, 10, 5),
    refillsLeft: 3,
    totalRefills: 3,
    notes: "Take at bedtime. Avoid grapefruit juice while taking this medication.",
    imageUrl: "/api/placeholder/400/320"
  }
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: {[key: string]: string} = {
    active: "bg-green-100 text-green-800 hover:bg-green-200",
    expired: "bg-red-100 text-red-800 hover:bg-red-200",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
  };

  const statusIcons: {[key: string]: React.ReactNode} = {
    active: <CheckCircle2 className="w-4 h-4 mr-1" />,
    expired: <X className="w-4 h-4 mr-1" />,
    pending: <Clock className="w-4 h-4 mr-1" />
  };

  return (
    <Badge className={`flex items-center ${statusStyles[status] || ''}`}>
      {statusIcons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Prescription card component
const PrescriptionCard = ({ prescription, onDelete }: { prescription: any, onDelete: (id: number) => void }) => {
  return (
    <Card className="mb-6 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-1">{prescription.name}</CardTitle>
            <CardDescription>
              Prescribed by {prescription.doctor} at {prescription.hospital}
            </CardDescription>
          </div>
          <StatusBadge status={prescription.status} />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <img 
            src={prescription.imageUrl} 
            alt="Prescription" 
            className="rounded-md w-full object-cover max-h-52" 
          />
        </div>
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Prescribed Date</p>
              <p className="font-medium">{format(prescription.date, "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium">{format(prescription.expiryDate, "MMM d, yyyy")}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Refills</p>
            <div className="flex items-center gap-2">
              <Progress 
                value={prescription.refillsLeft / prescription.totalRefills * 100} 
                className="h-2" 
              />
              <span className="text-sm font-medium">
                {prescription.refillsLeft}/{prescription.totalRefills}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-sm">{prescription.notes}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Download className="w-4 h-4" /> Download
        </Button>
        <Button variant="destructive" size="sm" className="gap-1" onClick={() => onDelete(prescription.id)}>
          <Trash2 className="w-4 h-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

// File upload component
const FileUpload = ({ onUpload }: { onUpload: (files: File[]) => void }) => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    // Filter for image files and PDFs
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only images and PDF files are allowed",
        variant: "destructive"
      });
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = () => {
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      onUpload(files);
      setFiles([]);
      
      toast({
        title: "Upload successful",
        description: `${files.length} prescription${files.length !== 1 ? 's' : ''} uploaded successfully`,
        variant: "default"
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="w-10 h-10 text-gray-400" />
          <h3 className="font-medium text-lg">Drop your prescription here</h3>
          <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
          <Input
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            id="prescription-upload"
            onChange={handleFileInput}
          />
          <Button asChild>
            <label htmlFor="prescription-upload" className="cursor-pointer">
              <PlusCircle className="w-4 h-4 mr-2" /> Select files
            </label>
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Selected files</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  {file.type === 'application/pdf' ? (
                    <FileText className="w-5 h-5 text-red-500" />
                  ) : (
                    <File className="w-5 h-5 text-blue-500" />
                  )}
                  <span className="truncate max-w-xs">{file.name}</span>
                  <span className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setFiles([])}>
              Clear all
            </Button>
            <Button onClick={uploadFiles} disabled={uploading}>
              {uploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" /> Upload {files.length} file{files.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching prescriptions from API
    setTimeout(() => {
      setPrescriptions(mockPrescriptions);
    }, 500);
  }, []);

  const handleDelete = (id: number) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
    toast({
      title: "Prescription deleted",
      description: "The prescription has been successfully deleted.",
      variant: "default"
    });
  };

  const handleUpload = (files: File[]) => {
    // Simulate adding new prescriptions
    const newPrescriptions = files.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      name: file.name.split('.')[0],
      doctor: "To be reviewed",
      hospital: "Pending verification",
      date: new Date(),
      status: "pending",
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
      refillsLeft: 0,
      totalRefills: 0,
      notes: "Awaiting provider confirmation",
      imageUrl: file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : "/api/placeholder/400/320"
    }));
    
    setPrescriptions(prev => [...newPrescriptions, ...prev]);
  };

  const renderPrescriptionsByStatus = (status: string) => {
    const filtered = prescriptions.filter(p => p.status === status);
    
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <AlertCircle className="w-10 h-10 text-gray-400 mb-4" />
          <h3 className="font-medium text-lg">No {status} prescriptions</h3>
          <p className="text-sm text-gray-500 max-w-md">
            {status === 'active' 
              ? "You don't have any active prescriptions. Upload a new prescription to get started."
              : status === 'pending' 
                ? "No prescriptions awaiting verification."
                : "You don't have any expired prescriptions."}
          </p>
        </div>
      );
    }
    
    return filtered.map(prescription => (
      <PrescriptionCard 
        key={prescription.id} 
        prescription={prescription} 
        onDelete={handleDelete} 
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">My Prescriptions</h1>
        <p className="text-gray-600">
          Manage your medical prescriptions, request refills, and upload new ones.
        </p>
      </header>

      <Tabs defaultValue="active" className="mb-10">
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
              {prescriptions.filter(p => p.status === 'active').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
              {prescriptions.filter(p => p.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired
            <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
              {prescriptions.filter(p => p.status === 'expired').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="upload">Upload New</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {renderPrescriptionsByStatus('active')}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {renderPrescriptionsByStatus('pending')}
        </TabsContent>

        <TabsContent value="expired" className="space-y-6">
          {renderPrescriptionsByStatus('expired')}
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Prescription</CardTitle>
              <CardDescription>
                Upload an image or PDF of your prescription. Our team will verify it and add it to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onUpload={handleUpload} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <section className="bg-blue-50 rounded-lg p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Need a prescription refill?</h2>
        <p className="mb-4">
          You can request refills for your active prescriptions directly through our app. 
          Your pharmacy will be notified, and you'll receive a confirmation when it's ready.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Request Refill
        </Button>
      </section>
    </div>
  );
}