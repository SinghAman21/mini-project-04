import React, { useState } from "react";
import { getStructuredBudgetData, StructuredBudgetData } from "../utils/gemini";
import { motion, AnimatePresence } from "framer-motion";
import {
	HiOutlineChartBar,
	HiOutlineCurrencyRupee,
	HiOutlineLocationMarker,
	HiOutlineShieldCheck,
	HiOutlineUser,
	HiOutlineArrowNarrowRight,
	HiOutlineDocumentText,
	HiOutlineRefresh,
	HiOutlineChartSquareBar,
	HiOutlinePrinter,
	HiOutlineDownload,
	HiOutlineExclamation,
} from "react-icons/hi";
import { useTheme } from "../providers/ThemeProvider";

// Import UI components
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
	CardTitle,
	CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

interface FormData {
	monthlyIncome: string;
	familySize: string;
	location: string;
	existingConditions: string;
	insuranceCoverage: string;
	ageGroups: {
		children: boolean;
		adults: boolean;
		seniors: boolean;
	};
	emergencyFund: string;
	question: string;
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
You are a specialized AI assistant for government healthcare budget allocation in India.

The output will be used by government officials for healthcare budget planning and allocation.
Focus solely on providing data-driven budget recommendations based on GDP, population statistics, and regional healthcare needs.

When analyzing budget needs, consider:
- State GDP (in Crores ₹)
- Population size (in lakhs)
- Regional healthcare infrastructure in the specified location
- Current emergency fund reserves
- Insurance coverage statistics
- Age demographic distribution
- Specific healthcare budget question

YOUR OUTPUT MUST be well-structured with:
1. Clear budget allocation recommendations with percentages and amounts
2. Evidence-based rationales for each recommendation
3. Prioritized key findings
4. Implementation guidance with detailed timeline phases
5. Professional, administrative language appropriate for government officials
`;

export default function Budget() {
	const [formData, setFormData] = useState<FormData>({
		monthlyIncome: "",
		familySize: "",
		location: "",
		existingConditions: "",
		insuranceCoverage: "",
		ageGroups: {
			children: false,
			adults: false,
			seniors: false,
		},
		emergencyFund: "",
		question: "",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [showForm, setShowForm] = useState(true);
	const [formStep, setFormStep] = useState(1);
	const [formProgress, setFormProgress] = useState(0);
	const [reportDate] = useState(new Date());
	const [budgetData, setBudgetData] = useState<StructuredBudgetData | null>(
		null
	);

	useTheme();

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;

		if (name.startsWith("ageGroups.")) {
			const ageGroup = name.split(".")[1];
			const isChecked = (e.target as HTMLInputElement).checked;

			setFormData((prev) => ({
				...prev,
				ageGroups: {
					...prev.ageGroups,
					[ageGroup]: isChecked,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleCheckboxChange = (
		ageGroup: keyof FormData["ageGroups"],
		checked: boolean
	) => {
		setFormData((prev) => ({
			...prev,
			ageGroups: {
				...prev.ageGroups,
				[ageGroup]: checked,
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const ageGroupsText = Object.entries(formData.ageGroups)
				.filter(([_, isSelected]) => isSelected)
				.map(([group]) => group)
				.join(", ");

			const prompt = `
${SYSTEM_INSTRUCTIONS}

GOVERNMENT DATA INPUTS:
- State GDP: ₹${formData.monthlyIncome} Crores
- Population: ${formData.familySize} Lakhs
- Location: ${formData.location}, India
- Existing Medical Conditions/Concerns: ${
				formData.existingConditions || "None specified"
			}
- Current Insurance Coverage Statistics: ${
				formData.insuranceCoverage || "None specified"
			}
- Age Demographics: ${ageGroupsText || "Not specified"}
- Emergency Healthcare Fund: ₹${formData.emergencyFund || "0"} Crores

BUDGET INQUIRY: ${formData.question}

Please provide a detailed healthcare budget allocation plan for government officials based on this data.
`;

			const data = await getStructuredBudgetData(prompt);
			setBudgetData(data);
			setShowForm(false);
		} catch (error) {
			console.error("Error getting response:", error);
			alert(
				"Sorry, there was an error processing your request. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
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
			monthlyIncome: "",
			familySize: "",
			location: "",
			existingConditions: "",
			insuranceCoverage: "",
			ageGroups: {
				children: false,
				adults: false,
				seniors: false,
			},
			emergencyFund: "",
			question: "",
		});
		setBudgetData(null);
		setShowForm(true);
		setFormStep(1);
		setFormProgress(0);
	};

	const formatDate = (date: Date) => {
		return date.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	};

	const printReport = () => {
		window.print();
	};

	const downloadReport = () => {
		alert("Report download functionality would be implemented here.");
	};

	return (
		<div className="w-full max-w-6xl mx-auto">
			<AnimatePresence mode="wait">
				{showForm ? (
					<motion.div
						key="form"
						variants={fadeIn}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="relative overflow-hidden"
					>
						<Card className="relative">
							<Progress
								value={formProgress}
								className="absolute top-0 mx-6 left-0 right-0 h-1 rounded-xl w-[95%]"
							/>

							<CardHeader className="pb-3">
								<div className="flex items-center justify-center">
									<HiOutlineChartBar className="text-primary text-xl mr-2" />
									<CardTitle className="text-2xl font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 dark:from-secondary-400 dark:to-secondary-200">
										Healthcare Budget Allocation Planner
									</CardTitle>
								</div>
								<CardDescription className="text-center max-w-md mx-auto">
									Official tool for analyzing healthcare budget requirements and
									generating allocation recommendations for government planning.
								</CardDescription>
							</CardHeader>

							<CardContent>
								<form onSubmit={formStep < 3 ? goToNextStep : handleSubmit}>
									<AnimatePresence mode="wait">
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
														Economic Parameters
													</h2>
													<p className="text-muted-foreground text-sm mb-6">
														Enter the key economic indicators for healthcare
														budget analysis.
													</p>
												</motion.div>

												<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
													<motion.div
														variants={itemVariants}
														className="space-y-2"
													>
														<Label
															htmlFor="monthlyIncome"
															className="flex items-center"
														>
															<HiOutlineCurrencyRupee className="mr-1 text-primary dark:text-secondary-400" />
															State GDP (in Crores ₹)
														</Label>
														<div className="relative">
															<Input
																id="monthlyIncome"
																type="number"
																name="monthlyIncome"
																value={formData.monthlyIncome}
																onChange={handleChange}
																required
																className="pl-8"
																placeholder="e.g., 50000"
															/>
															<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
																₹
															</div>
														</div>
													</motion.div>

													<motion.div
														variants={itemVariants}
														className="space-y-2"
													>
														<Label
															htmlFor="familySize"
															className="flex items-center"
														>
															<HiOutlineUser className="mr-1 text-primary dark:text-secondary-400" />
															Population (in lakhs)
														</Label>
														<Input
															id="familySize"
															type="number"
															name="familySize"
															value={formData.familySize}
															onChange={handleChange}
															required
															placeholder="e.g., 450"
														/>
													</motion.div>
												</div>

												<motion.div
													variants={itemVariants}
													className="space-y-2"
												>
													<Label
														htmlFor="location"
														className="flex items-center"
													>
														<HiOutlineLocationMarker className="mr-1 text-primary dark:text-secondary-400" />
														State/Region in India
													</Label>
													<Input
														id="location"
														type="text"
														name="location"
														value={formData.location}
														onChange={handleChange}
														required
														placeholder="e.g., Maharashtra, Tamil Nadu, etc."
													/>
												</motion.div>

												<motion.div variants={itemVariants} className="pt-4">
													<Button
														type="submit"
														className="w-full flex items-center justify-center"
													>
														<span>Continue</span>
														<HiOutlineArrowNarrowRight className="ml-2" />
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
														Healthcare Financial Data
													</h2>
													<p className="text-muted-foreground text-sm mb-6">
														Provide details on existing healthcare financial
														resources and infrastructure.
													</p>
												</motion.div>

												<motion.div
													variants={itemVariants}
													className="space-y-2"
												>
													<Label
														htmlFor="emergencyFund"
														className="flex items-center"
													>
														<HiOutlineCurrencyRupee className="mr-1 text-primary dark:text-secondary-400" />
														Emergency Healthcare Fund (in Crores ₹)
													</Label>
													<div className="relative">
														<Input
															id="emergencyFund"
															type="number"
															name="emergencyFund"
															value={formData.emergencyFund}
															onChange={handleChange}
															className="pl-8"
															placeholder="e.g., 500"
														/>
														<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
															₹
														</div>
													</div>
												</motion.div>

												<motion.div
													variants={itemVariants}
													className="space-y-2"
												>
													<Label
														htmlFor="insuranceCoverage"
														className="flex items-center"
													>
														<HiOutlineShieldCheck className="mr-1 text-primary dark:text-secondary-400" />
														Current Insurance Schemes & Coverage
													</Label>
													<Textarea
														id="insuranceCoverage"
														name="insuranceCoverage"
														value={formData.insuranceCoverage}
														onChange={handleChange}
														placeholder="e.g., Ayushman Bharat covers 40% of population, Employee health insurance covers 15%, etc."
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
															Back
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
															<HiOutlineArrowNarrowRight className="ml-2" />
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
														Budget Planning Requirements
													</h2>
													<p className="text-muted-foreground text-sm mb-6">
														Specify healthcare budget planning requirements and
														demographic considerations.
													</p>
												</motion.div>

												<motion.div
													variants={itemVariants}
													className="space-y-2"
												>
													<Label
														htmlFor="existingConditions"
														className="flex items-center"
													>
														<HiOutlineExclamation className="mr-1 text-primary dark:text-secondary-400" />
														Current Healthcare Challenges or Focus Areas
													</Label>
													<Textarea
														id="existingConditions"
														name="existingConditions"
														value={formData.existingConditions}
														onChange={handleChange}
														placeholder="e.g., High maternal mortality rate, Increasing diabetes cases, Infrastructure gaps in rural areas, etc."
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
														<HiOutlineDocumentText className="mr-1 text-primary dark:text-secondary-400" />
														Budget Planning Objective
													</Label>
													<Textarea
														id="question"
														name="question"
														value={formData.question}
														onChange={handleChange}
														required
														placeholder="e.g., How should we allocate the health budget for the upcoming fiscal year with focus on reducing infant mortality? What percentage should be allocated to preventive healthcare vs curative services?"
														rows={3}
													/>
												</motion.div>

												<div className="space-y-4 pt-2">
													<motion.div variants={itemVariants}>
														<div className="flex flex-col space-y-1.5">
															<Label className="text-sm font-medium flex items-center">
																<HiOutlineUser className="mr-1 text-primary dark:text-secondary-400" />
																Priority Age Demographics (select all that
																apply)
															</Label>
														</div>
														<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
															<div className="flex items-center space-x-2">
																<Checkbox
																	id="children"
																	checked={formData.ageGroups.children}
																	onCheckedChange={(checked) =>
																		handleCheckboxChange(
																			"children",
																			checked === true
																		)
																	}
																/>
																<Label
																	htmlFor="children"
																	className="text-sm cursor-pointer"
																>
																	Children (0-18)
																</Label>
															</div>
															<div className="flex items-center space-x-2">
																<Checkbox
																	id="adults"
																	checked={formData.ageGroups.adults}
																	onCheckedChange={(checked) =>
																		handleCheckboxChange(
																			"adults",
																			checked === true
																		)
																	}
																/>
																<Label
																	htmlFor="adults"
																	className="text-sm cursor-pointer"
																>
																	Adults (19-59)
																</Label>
															</div>
															<div className="flex items-center space-x-2">
																<Checkbox
																	id="seniors"
																	checked={formData.ageGroups.seniors}
																	onCheckedChange={(checked) =>
																		handleCheckboxChange(
																			"seniors",
																			checked === true
																		)
																	}
																/>
																<Label
																	htmlFor="seniors"
																	className="text-sm cursor-pointer"
																>
																	Seniors (60+)
																</Label>
															</div>
														</div>
													</motion.div>
												</div>

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
															Back
														</Button>
													</motion.div>
													<motion.div
														variants={itemVariants}
														className="flex-1"
													>
														<Button
															type="submit"
															disabled={isLoading}
															className="w-full"
														>
															{isLoading ? (
																<div className="flex items-center justify-center">
																	<motion.div
																		animate={{ rotate: 360 }}
																		transition={{
																			duration: 1,
																			repeat: Infinity,
																			ease: "linear",
																		}}
																		className="mr-2"
																	>
																		<svg
																			className="animate-spin h-5 w-5"
																			xmlns="http://www.w3.org/2000/svg"
																			fill="none"
																			viewBox="0 0 24 24"
																		>
																			<circle
																				className="opacity-25"
																				cx="12"
																				cy="12"
																				r="10"
																				stroke="currentColor"
																				strokeWidth="4"
																			></circle>
																			<path
																				className="opacity-75"
																				fill="currentColor"
																				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																			></path>
																		</svg>
																	</motion.div>
																	<span>Generating Report...</span>
																</div>
															) : (
																<div className="flex items-center justify-center">
																	<span>Generate Budget Report</span>
																	<HiOutlineChartSquareBar className="ml-2" />
																</div>
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
					</motion.div>
				) : (
					<motion.div
						key="results"
						variants={fadeIn}
						initial="hidden"
						animate={`visible`}
						exit="exit"
					>
						<Card className="print:shadow-none">
							<Progress
								value={100}
								className="h-1 rounded-none print:hidden hidden"
							/>

							<CardHeader className="print:pb-2">
								<div className="flex items-center justify-between print:flex-col print:items-start">
									<div className="flex flex-col">
										<div className="flex items-center gap-2 mb-1">
											<img
												src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
												alt="Government of India Emblem"
												className="h-10 w-auto print:h-14 dark:invert-100"
											/>
											<div className="flex flex-col">
												<CardTitle className="text-xl font-display">
													{budgetData?.title ||
														"Healthcare Budget Allocation Report"}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													Government of India - Ministry of Health
												</p>
											</div>
										</div>
										<p className="text-sm text-muted-foreground mt-1">
											Report Generated: {formatDate(reportDate)} | Reference ID:
											HBAR-
											{Math.floor(Math.random() * 1000000)
												.toString()
												.padStart(6, "0")}
										</p>
									</div>

									<div className="flex gap-2 print:hidden">
										<Button
											onClick={printReport}
											size="sm"
											variant="outline"
											className="flex items-center gap-1"
										>
											<HiOutlinePrinter className="h-4 w-4" />
											<span>Print</span>
										</Button>
										<Button
											onClick={downloadReport}
											size="sm"
											variant="outline"
											className="flex items-center gap-1"
										>
											<HiOutlineDownload className="h-4 w-4" />
											<span>Download</span>
										</Button>
									</div>
								</div>

								<Separator className="my-3 print:my-2" />

								<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">State/Region:</span>
										<span className="text-sm">{formData.location}</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">GDP:</span>
										<span className="text-sm">
											₹{formData.monthlyIncome} Crores
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Population:</span>
										<span className="text-sm">{formData.familySize} Lakhs</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Emergency Fund:</span>
										<span className="text-sm">
											₹{formData.emergencyFund || "0"} Crores
										</span>
									</div>
								</div>
							</CardHeader>

							<CardContent className="prose prose-gray dark:prose-invert max-w-none print:prose-sm">
								<div className="space-y-8">
									<div>
										<h3 className="text-lg font-semibold border-b border-dashed pb-2 mb-3">
											Key Findings
										</h3>
										<div className="overflow-x-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b">
														<th className="py-2 px-3 text-left font-medium text-sm">
															Finding
														</th>
														<th className="py-2 px-3 text-left font-medium text-sm">
															Budget Implication
														</th>
														<th className="py-2 px-3 text-center font-medium text-sm">
															Priority
														</th>
													</tr>
												</thead>
												<tbody>
													{budgetData && budgetData.findings.length > 0 ? (
														budgetData.findings.map((finding, idx) => (
															<tr key={idx} className="border-b">
																<td className="py-2 px-3 text-sm">
																	{finding.key}
																</td>
																<td className="py-2 px-3 text-sm">
																	{finding.value}
																</td>
																<td className="py-2 px-3 text-center">
																	<Badge
																		variant={
																			finding.priority === "high"
																				? "destructive"
																				: finding.priority === "medium"
																				? "default"
																				: "outline"
																		}
																		className="text-xs capitalize print:bg-transparent print:border print:border-gray-400 print:text-black"
																	>
																		{finding.priority}
																	</Badge>
																</td>
															</tr>
														))
													) : (
														<tr>
															<td
																colSpan={3}
																className="py-4 text-center text-sm text-muted-foreground"
															>
																No findings available
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</div>

									{/* Budget Allocation Section */}
									<div>
										<h3 className="text-lg font-semibold border-b border-dashed pb-2 mb-3">
											Recommended Budget Allocation
										</h3>
										<div className="overflow-x-auto">
											<table className="w-full">
												<thead>
													<tr className="border-b">
														<th className="py-2 px-3 text-left font-medium text-sm">
															Category
														</th>
														<th className="py-2 px-3 text-right font-medium text-sm">
															Percentage
														</th>
														<th className="py-2 px-3 text-right font-medium text-sm">
															Amount (₹ Cr)
														</th>
														<th className="py-2 px-3 text-left font-medium text-sm">
															Description
														</th>
													</tr>
												</thead>
												<tbody>
													{budgetData && budgetData.allocations.length > 0 ? (
														budgetData.allocations.map((allocation, idx) => (
															<tr key={idx} className="border-b">
																<td className="py-2 px-3 text-sm font-medium">
																	{allocation.category}
																</td>
																<td className="py-2 px-3 text-sm text-right">
																	{allocation.percentage}%
																</td>
																<td className="py-2 px-3 text-sm text-right w-32">
																	{allocation.amount}
																</td>
																<td className="py-2 px-3 text-sm text-justify">
																	{allocation.description}
																</td>
															</tr>
														))
													) : (
														<tr>
															<td
																colSpan={4}
																className="py-4 text-center text-sm text-muted-foreground"
															>
																No allocations available
															</td>
														</tr>
													)}

													{budgetData && budgetData.allocations.length > 0 && (
														<tr className="bg-muted/30">
															<td className="py-2 px-3 text-sm font-semibold">
																Total
															</td>
															<td className="py-2 px-3 text-sm font-semibold text-right">
																{budgetData.allocations
																	.reduce(
																		(acc, curr) => acc + curr.percentage,
																		0
																	)
																	.toFixed(1)}
																%
															</td>
															<td className="py-2 px-3 text-sm font-semibold text-right">
																₹{formData.monthlyIncome} Cr
															</td>
															<td className="py-2 px-3"></td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</div>

									{budgetData &&
										budgetData.implementationTimeline.length > 0 && (
											<div>
												<h3 className="text-lg font-semibold border-b pb-2 mb-3">
													Implementation Timeline & Guidance
												</h3>
												<div className="text-sm leading-relaxed">
													{budgetData.implementationTimeline.map(
														(phase, idx) => (
															<div key={idx} className="mb-4">
																<h4 className="font-bold mb-2">
																	{phase.title}
																</h4>
																<ul className="list-disc pl-5 space-y-1">
																	{phase.items.map((item, itemIdx) => (
																		<li key={itemIdx}>{item}</li>
																	))}
																</ul>
															</div>
														)
													)}
												</div>
											</div>
										)}
								</div>
							</CardContent>

							<CardFooter className="flex justify-between items-center print:hidden">
								<p className="text-xs text-muted-foreground">
									This report is generated based on the provided inputs and is
									intended for government planning purposes.
								</p>
								<Button
									variant="outline"
									onClick={resetForm}
									className="flex items-center text-primary dark:text-secondary hover:text-primary/80 dark:hover:text-secondary/80 transition-colors duration-200"
								>
									<HiOutlineRefresh className="mr-2 text-primary" />
									<span className="text-primary">New Analysis</span>
								</Button>
							</CardFooter>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
