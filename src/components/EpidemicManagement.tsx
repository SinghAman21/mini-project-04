import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { cn } from "../lib/utils";
import { useTheme } from "../providers/ThemeProvider";
import {
  MapPin,
  Shield,
  FileText,
  User,
  ArrowRight,
  ArrowLeft,
  Download,
  RefreshCw,
  ClipboardCheck,
  Biohazard,
  AlertOctagon,
  Building2,
  Check,
  ChevronsUpDown
} from "lucide-react";

import { getStructuredEpidemicData } from "../utils/gemini";
import govtLogo from "../assets/govtLogo.svg"

interface FormData {
  location: string;
  diseaseType: string;
  populationAffected: string;
  infectionRate: string;
  mortalityRate: string;
  currentResources: string;
  vaccineStatus: string;
  infrastructureStatus: string;
  question: string;
}

interface StructuredEpidemicData {
  title: string;
  summary: string;
  keyFindings: { title: string; description: string }[];
  actionPlan: {
    category: string;
    actions: string[];
    priority: string;
    timeline: string;
  }[];
  resourceAllocation: {
    category: string;
    percentage: number;
    amount: string;
    description: string;
  }[];
  implementationTimeline: {
    title: string;
    items: string[];
  }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const SYSTEM_INSTRUCTIONS = `
You are a specialized AI assistant for government epidemic management and healthcare system control in India.
Your role is to provide detailed epidemic management plans, supply chain management strategies, and insurance recommendations.

The output will be used by government officials for epidemic response planning and healthcare system management.
Focus solely on providing data-driven recommendations based on epidemic data, population statistics, and regional healthcare needs.

When analyzing epidemic management needs, consider:
- Location and population demographics
- Disease type and characteristics
- Infection and mortality rates
- Current healthcare infrastructure and resources
- Vaccine status and availability
- Supply chain capabilities
- Insurance coverage and financing options

YOUR OUTPUT MUST be well-structured with:
1. Clear epidemic management recommendations with action items
2. Resource allocation recommendations with percentages and amounts
3. Evidence-based rationales for each recommendation
4. Implementation guidance with detailed timeline phases
5. Professional, administrative language appropriate for government officials
`;

export default function EpidemicManagement() {
  const [formData, setFormData] = useState<FormData>({
    location: "",
    diseaseType: "",
    populationAffected: "",
    infectionRate: "",
    mortalityRate: "",
    currentResources: "",
    vaccineStatus: "",
    infrastructureStatus: "",
    question: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const [formProgress, setFormProgress] = useState(2);
  const [reportDate] = useState(new Date());
  const [epidemicData, setEpidemicData] = useState<StructuredEpidemicData | null>(null);

  useTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const goToNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const nextStep = formStep + 1;
    setFormStep(nextStep);
    setFormProgress((nextStep - 1) * 33.3);
  };

  const goToPrevStep = () => {
    const prevStep = formStep - 1;
    setFormStep(prevStep);
    setFormProgress((prevStep - 1) * 33.3);
  };

  const resetForm = () => {
    setFormData({
      location: "",
      diseaseType: "",
      populationAffected: "",
      infectionRate: "",
      mortalityRate: "",
      currentResources: "",
      vaccineStatus: "",
      infrastructureStatus: "",
      question: "",
    });
    setEpidemicData(null);
    setShowForm(true);
    setFormStep(1);
    setFormProgress(0);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const prompt = `
${SYSTEM_INSTRUCTIONS}

EPIDEMIC MANAGEMENT DATA INPUTS:
- Location: ${formData.location}, India
- Disease Type: ${formData.diseaseType}
- Population Affected: ${formData.populationAffected} Lakhs
- Infection Rate: ${formData.infectionRate}%
- Mortality Rate: ${formData.mortalityRate}%
- Current Resources: ${formData.currentResources || "Not specified"}
- Vaccine Status: ${formData.vaccineStatus || "Not specified"}
- Healthcare Infrastructure Status: ${formData.infrastructureStatus || "Not specified"}

MANAGEMENT INQUIRY: ${formData.question}

Please provide a detailed epidemic management plan for government officials based on this data.
`;

      // For now we'll reuse the budget data structure but this would need a dedicated function
      const data = await getStructuredEpidemicData(prompt);
      setEpidemicData(data);
      setShowForm(false);
    } catch (error) {
      console.error("Error getting response:", error);
      alert("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto print:max-w-none">
      {showForm ? (
        <Card className="shadow-lg dark:shadow-gray-900/30 print:shadow-none">
          <CardHeader className="text-center space-y-2">
            <div>
              <CardTitle className="text-2xl font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-secondary-400 dark:to-secondary-200">
                Epidemic Management & Healthcare System Control
              </CardTitle>
            </div>
            <CardDescription className="text-center max-w-md mx-auto">
              Official tool for analyzing epidemic outbreaks and generating management plans, SCM strategies, and insurance recommendations for government planning.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={formStep < 3 ? goToNextStep : handleSubmit}>
              <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Basic Info</span>
                  <span>Resources</span>
                  <span>Management Needs</span>
                </div>
                <Progress value={formProgress} className="h-2" />
              </div>

              <AnimatePresence>
                {formStep === 1 && (
                  <motion.div
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="text-lg font-semibold mb-3 text-primary-700 dark:text-secondary-300 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-secondary-900/50 border border-primary/30 dark:border-secondary/30 flex items-center justify-center mr-2 text-primary dark:text-secondary-300">
                          1
                        </span>
                        Basic Epidemic Information
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Enter the key epidemic indicators for analysis.
                      </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="location"
                          className="flex items-center"
                        >
                          <MapPin className="mr-1 text-primary dark:text-secondary-400" />
                          State/Region in India
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {formData.location || "Select a state/region"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="p-0" 
                            align="start"
                            side="top"
                            sideOffset={4}
                            alignOffset={0}
                            avoidCollisions={true}
                          >
                            <Command>
                              <CommandInput placeholder="Search state..." className="h-9" />
                              <CommandEmpty>No state found.</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-auto">
                                {[
                                  "Andhra Pradesh",
                                  "Arunachal Pradesh",
                                  "Assam",
                                  "Bihar",
                                  "Chhattisgarh",
                                  "Goa",
                                  "Gujarat",
                                  "Haryana",
                                  "Himachal Pradesh",
                                  "Jharkhand",
                                  "Karnataka",
                                  "Kerala",
                                  "Madhya Pradesh",
                                  "Maharashtra",
                                  "Manipur",
                                  "Meghalaya",
                                  "Mizoram",
                                  "Nagaland",
                                  "Odisha",
                                  "Punjab",
                                  "Rajasthan",
                                  "Sikkim",
                                  "Tamil Nadu",
                                  "Telangana",
                                  "Tripura",
                                  "Uttar Pradesh",
                                  "Uttarakhand",
                                  "West Bengal",
                                  "Delhi",
                                  "Other"
                                ].map((state) => (
                                  <CommandItem
                                    key={state}
                                    onSelect={() => {
                                      handleSelectChange("location", state);
                                      document.dispatchEvent(new Event("popover.close"));
                                    }}
                                  >
                                    {state}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        formData.location === state
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formData.location === "Other" && (
                          <Input
                            type="text"
                            placeholder="Please specify location"
                            className="mt-2"
                            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                          />
                        )}
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="diseaseType"
                          className="flex items-center"
                        >
                          <Biohazard className="mr-1 text-primary dark:text-secondary-400" />
                          Disease Type
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {formData.diseaseType || "Select a disease type"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent 
                            className="w-[300px] p-0" 
                            align="start"
                            side="bottom"
                            sideOffset={4}
                            alignOffset={0}
                            avoidCollisions={true}
                          >
                            <Command>
                              <CommandInput placeholder="Search disease..." className="h-9" />
                              <CommandEmpty>No disease found.</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-auto">
                                {[
                                  "COVID-19",
                                  "Dengue",
                                  "Malaria",
                                  "Cholera",
                                  "Tuberculosis",
                                  "Measles",
                                  "Influenza",
                                  "Other"
                                ].map((disease) => (
                                  <CommandItem
                                    key={disease}
                                    onSelect={() => {
                                      handleSelectChange("diseaseType", disease);
                                      document.dispatchEvent(new Event("popover.close"));
                                    }}
                                  >
                                    {disease}
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        formData.diseaseType === disease
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {formData.diseaseType === "Other" && (
                          <Input
                            type="text"
                            placeholder="Please specify disease"
                            className="mt-2"
                            onChange={(e) => setFormData((prev) => ({ ...prev, diseaseType: e.target.value }))}
                          />
                        )}
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="populationAffected"
                          className="flex items-center"
                        >
                          <User className="mr-1 text-primary dark:text-secondary-400" />
                          Population Affected (in Lakhs)
                        </Label>
                        <Input
                          id="populationAffected"
                          type="number"
                          name="populationAffected"
                          value={formData.populationAffected}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 5"
                        />
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="space-y-2"
                      >
                        <Label
                          htmlFor="infectionRate"
                          className="flex items-center"
                        >
                          <AlertOctagon className="mr-1 text-primary dark:text-secondary-400" />
                          Infection Rate (%)
                        </Label>
                        <Input
                          id="infectionRate"
                          type="number"
                          name="infectionRate"
                          value={formData.infectionRate}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 2.5"
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="pt-4">
                      <Button
                        type="submit"
                        className="w-full flex items-center justify-center"
                      >
                        <span>Continue</span>
                        <ArrowRight className="ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {formStep === 2 && (
                  <motion.div
                    key="step2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="text-lg font-semibold mb-3 text-primary-700 dark:text-secondary-300 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-secondary-900/50 border border-primary/30 dark:border-secondary/30 flex items-center justify-center mr-2 text-primary dark:text-secondary-300">
                          2
                        </span>
                        Healthcare Resources & Infrastructure
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Provide details on existing healthcare resources and infrastructure.
                      </p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="currentResources"
                        className="flex items-center"
                      >
                        <ClipboardCheck className="mr-1 text-primary dark:text-secondary-400" />
                        Current Medical Resources
                      </Label>
                      <Textarea
                        id="currentResources"
                        name="currentResources"
                        value={formData.currentResources}
                        onChange={handleChange}
                        placeholder="e.g., 5000 hospital beds, 500 ventilators, 10,000 PPE kits, etc."
                        rows={3}
                      />
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="vaccineStatus"
                        className="flex items-center"
                      >
                        <Shield className="mr-1 text-primary dark:text-secondary-400" />
                        Vaccine Status & Supply Chain
                      </Label>
                      <Textarea
                        id="vaccineStatus"
                        name="vaccineStatus"
                        value={formData.vaccineStatus}
                        onChange={handleChange}
                        placeholder="e.g., 40% population vaccinated, 100,000 doses available, limited cold chain facilities, etc."
                        rows={3}
                      />
                    </motion.div>

                    <div className="flex space-x-4 pt-4">
                      <motion.div
                        variants={itemVariants}
                        className="flex-1"
                      >
                        <Button
                          type="button"
                          onClick={goToPrevStep}
                          variant="outline"
                          className="w-full"
                        >
                          <ArrowLeft className="mr-2" />
                          <span>Back</span>
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        className="flex-1"
                      >
                        <Button
                          type="submit"
                          className="w-full flex items-center justify-center"
                        >
                          <span>Continue</span>
                          <ArrowRight className="ml-2" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {formStep === 3 && (
                  <motion.div
                    key="step3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants} className="mb-8">
                      <h2 className="text-lg font-semibold mb-3 text-primary-700 dark:text-secondary-300 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-primary/10 dark:bg-secondary-900/50 border border-primary/30 dark:border-secondary/30 flex items-center justify-center mr-2 text-primary dark:text-secondary-300">
                          3
                        </span>
                        Management & Insurance Requirements
                      </h2>
                      <p className="text-muted-foreground text-sm mb-6">
                        Specify epidemic management requirements and insurance considerations.
                      </p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="infrastructureStatus"
                        className="flex items-center"
                      >
                        <Building2 className="mr-1 text-primary dark:text-secondary-400" />
                        Healthcare Infrastructure Status
                      </Label>
                      <Textarea
                        id="infrastructureStatus"
                        name="infrastructureStatus"
                        value={formData.infrastructureStatus}
                        onChange={handleChange}
                        placeholder="e.g., 10 major hospitals, 50 primary health centers, limited ICU capacity, etc."
                        rows={2}
                      />
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="question"
                        className="flex items-center"
                      >
                        <FileText className="mr-1 text-primary dark:text-secondary-400" />
                        Management Plan Objective
                      </Label>
                      <Textarea
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        placeholder="e.g., How should we manage the current dengue outbreak? What strategies should be implemented for vaccine distribution? What insurance schemes would be effective?"
                        rows={3}
                      />
                    </motion.div>

                    <div className="flex space-x-4 pt-4">
                      <motion.div
                        variants={itemVariants}
                        className="flex-1"
                      >
                        <Button
                          type="button"
                          onClick={goToPrevStep}
                          variant="outline"
                          className="w-full flex items-center justify-center"
                        >
                          <ArrowLeft className="mr-2" />
                          <span>Back</span>
                        </Button>
                      </motion.div>
                      <motion.div
                        variants={itemVariants}
                        className="flex-1"
                      >
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex items-center justify-center"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <span>Generate Plan</span>
                              <FileText className="ml-2" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="print:m-6"
        >
          <Card className="shadow-lg dark:shadow-gray-900/30 mb-6 print:shadow-none print:border-0">
            <CardHeader className="print:pb-2">
              <div className="flex items-center gap-4">
                <img
                  src={govtLogo}
                  alt="Government of India Emblem"
                  className="h-10 w-auto print:h-14 dark:invert-100"
                />
                <div className="flex flex-col">
                  <CardTitle className="text-xl font-display">
                    {epidemicData?.title || "Epidemic Management Plan"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Government of India - Ministry of Health
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Report Generated: {formatDate(reportDate)} | Reference ID: EMP-
                {Math.floor(Math.random() * 1000000)
                  .toString()
                  .padStart(6, "0")}
              </p>
            </CardHeader>

            <div className="flex gap-2 px-6 print:hidden">
              <Button
                onClick={printReport}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>Print/Save PDF</span>
              </Button>
              <Button
                onClick={resetForm}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Start Over</span>
              </Button>
            </div>

            <CardHeader className="print:pt-2">
              <div className="space-y-2 bg-light-100 dark:bg-dark-100 rounded-lg p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Location:</span>
                  <span className="text-sm">{formData.location}, India</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Disease Type:</span>
                  <span className="text-sm">{formData.diseaseType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Population:</span>
                  <span className="text-sm">{formData.populationAffected} Lakhs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Infection Rate:</span>
                  <span className="text-sm">{formData.infectionRate}%</span>
                </div>
                {/* <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mortality Rate:</span>
                  <span className="text-sm">{formData.mortalityRate}%</span>
                </div> */}
              </div>
            </CardHeader>

            <CardContent className="prose prose-gray dark:prose-invert max-w-none print:prose-sm">
              {epidemicData ? (
                <div className="space-y-8">
                  {/* Executive Summary */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-dashed pb-2 mb-3">
                      Executive Summary
                    </h3>
                    <div className="bg-muted/30 p-3 rounded-md">
                      <p>{epidemicData.summary}</p>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-dashed pb-2 mb-3">
                      Key Findings
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {epidemicData.keyFindings.map((finding, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <h4 className="text-base font-medium mb-1">{finding.title}</h4>
                          <p className="text-sm text-muted-foreground">{finding.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-dashed pb-2 mb-3">
                      Action Plan
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {epidemicData.actionPlan.map((plan, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-medium">{plan.category}</h4>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                plan.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                                plan.priority === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)} Priority
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                {plan.timeline}
                              </span>
                            </div>
                          </div>
                          <ul className="mt-2 space-y-1 list-disc pl-5">
                            {plan.actions.map((action, idx) => (
                              <li key={idx} className="text-sm">{action}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resource Allocation */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-dashed pb-2 mb-3">
                      Resource Allocation
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left px-2 py-2">Category</th>
                            <th className="text-right px-2 py-2">Percentage</th>
                            <th className="text-right px-2 py-2">Amount</th>
                            <th className="text-left px-2 py-2">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {epidemicData.resourceAllocation.map((resource, index) => (
                            <tr key={index} className="border-b">
                              <td className="px-2 py-2 font-medium">{resource.category}</td>
                              <td className="px-2 py-2 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary dark:bg-secondary-400" 
                                      style={{ width: `${Math.min(100, resource.percentage)}%` }}
                                    ></div>
                                  </div>
                                  <span>{resource.percentage}%</span>
                                </div>
                              </td>
                              <td className="px-2 py-2 text-right ">{resource.amount}</td>
                              <td className="px-2 py-2 text-sm text-muted-foreground">{resource.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Implementation Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold border-b border-dashed pb-2 mb-3">
                      Implementation Timeline
                    </h3>
                    <div className="relative space-y-6">
                      {epidemicData.implementationTimeline.map((phase, index) => (
                        <div key={index} className="relative pl-8">
                          {index < epidemicData.implementationTimeline.length - 1 && (
                            <div className="absolute left-3 top-4 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                          )}
                          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 dark:bg-secondary-800 border border-primary/30 dark:border-secondary-700">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="text-base font-medium mb-2">{phase.title}</h4>
                            <ul className="space-y-1 list-disc pl-5">
                              {phase.items.map((item, idx) => (
                                <li key={idx} className="text-sm">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p>No report data available. Please try generating a report again.</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between items-center print:hidden">
              <p className="text-xs text-muted-foreground">
                This report is generated based on the provided inputs and is intended for government planning purposes.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}