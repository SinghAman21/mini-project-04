import React, { useState } from "react";
import { HiOutlineScale, HiOutlineDocumentText } from "react-icons/hi";
import { Gavel } from "lucide-react";
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

const CaseAnalysis = () => {
	const [formData, setFormData] = useState({
		caseType: "",
		location: "",
		caseDescription: "",
		specificQuestion: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Case analysis:", formData);
	};

	return (
		<div className="h-full overflow-auto p-6">
			<div className="text-center mb-8">
				<div className="flex items-center justify-center mb-4">
					<div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-secondary-500 dark:to-secondary-800 rounded-xl flex items-center justify-center">
						<HiOutlineScale className="text-white text-2xl" />
					</div>
				</div>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
					Legal Case Analysis Tool
				</h1>
				<p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
					Get comprehensive legal analysis and strategy recommendations
				</p>
				<div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg max-w-md mx-auto">
					⚖️ This provides general legal information only. Consult a qualified
					lawyer for specific legal advice.
				</div>
			</div>

			<form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
				<div className="grid gap-6 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<HiOutlineScale className="h-5 w-5" />
								Case Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="caseType">Case Type</Label>
								<Input
									id="caseType"
									name="caseType"
									value={formData.caseType}
									onChange={handleInputChange}
									placeholder="e.g., Contract Dispute, Property Case"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="location">Location/Jurisdiction</Label>
								<Input
									id="location"
									name="location"
									value={formData.location}
									onChange={handleInputChange}
									placeholder="e.g., Mumbai High Court"
									required
								/>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<HiOutlineDocumentText className="h-5 w-5" />
								Case Details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="caseDescription">Case Description</Label>
								<Textarea
									id="caseDescription"
									name="caseDescription"
									value={formData.caseDescription}
									onChange={handleInputChange}
									placeholder="Describe your legal case..."
									className="min-h-[100px]"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="specificQuestion">Specific Question</Label>
								<Textarea
									id="specificQuestion"
									name="specificQuestion"
									value={formData.specificQuestion}
									onChange={handleInputChange}
									placeholder="What legal guidance do you need?"
									className="min-h-[80px]"
									required
								/>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex justify-center">
					<Button type="submit" size="lg" className="flex items-center gap-2">
						<Gavel className="h-5 w-5" />
						Analyze Case
					</Button>
				</div>
			</form>

			<div className="mt-12 text-center">
				<Card>
					<CardContent className="pt-6">
						<Gavel className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
						<h3 className="text-xl font-semibold mb-2">Analysis Results</h3>
						<p className="text-muted-foreground">
							Submit the form above to generate comprehensive legal analysis and
							recommendations.
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default CaseAnalysis;
