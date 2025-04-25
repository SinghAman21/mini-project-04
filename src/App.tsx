import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, MessageCircle, Biohazard } from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
	const navigate = useNavigate();

	return (
		<div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
			<div className="absolute inset-0 w-full h-full">
				<div className="absolute top-[-10%] left-[-10%] right-0 bottom-0 opacity-20 dark:opacity-10 z-0">
					<div className="absolute top-0 left-[25%] w-[50%] h-[50%] bg-purple-500/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob" />
					<div className="absolute top-[25%] left-[10%] w-[50%] h-[50%] bg-cyan-500/30 dark:bg-cyan-600/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000" />
					<div className="absolute top-[40%] left-[40%] w-[50%] h-[50%] bg-primary/30 dark:bg-primary/20 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000" />
				</div>
			</div>

			{/* Content */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="max-w-5xl mx-auto text-center relative z-10"
			>
				<h1 className="text-5xl font-display font-bold mb-3 tracking-tight text-foreground backdrop-blur-sm py-2">
					Welcome to HealthCare{" "}
					<span className="relative">
						AI
						<span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-primary"></span>
					</span>
				</h1>

				<p className="text-lg mb-16 text-muted-foreground max-w-2xl mx-auto border-b pb-6 border-border/30 backdrop-blur-sm">
					Your intelligent healthcare planning and management assistant for
					better decision making
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
					<motion.div
						className="cursor-pointer group relative flex flex-col p-6 rounded-lg bg-card/80 backdrop-blur-md border border-border/50 shadow-md"
						onClick={() => navigate("/chat")}
					>
						<div className="absolute -top-3 -left-3 w-12 h-12 rounded-md flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-500 backdrop-blur-md border border-white/10 dark:border-white/5">
							<MessageCircle className="h-5 w-5 text-primary-foreground" />
						</div>

						<div className="ml-6 mt-2">
							<h3 className="text-xl font-semibold mb-2 text-card-foreground">
								Healthcare Assistant
							</h3>
							<p className="text-sm text-muted-foreground mb-8 line-clamp-2">
								Chat with our AI to get personalized healthcare advice and
								information
							</p>
						</div>

						<div className="mt-auto">
							<Button
								className="w-full bg-gradient-to-r from-background ease-in to-background hover:from-purple-400/80 hover:to-purple-600 border-border/30 transition-all cursor-pointer"
								variant="outline"
								onClick={() => navigate("/chat")}
							>
								Start Chatting
							</Button>
						</div>

						<div className="h-1.5 w-full absolute bottom-0 left-0 bg-gradient-to-r from-purple-400/20 to-primary/20 dark:from-purple-600/20 dark:to-primary/20 rounded-b-lg overflow-hidden">
							<motion.div
								initial={{ width: "0%" }}
								whileHover={{ width: "100%" }}
								className="h-full bg-gradient-to-r from-purple-400 to-primary dark:from-purple-600 dark:to-primary"
							/>
						</div>
					</motion.div>

					<motion.div
						className="cursor-pointer group relative flex flex-col p-6 rounded-lg bg-card/80 backdrop-blur-md border border-border/50 shadow-md"
						onClick={() => navigate("/budget")}
					>
						<div className="absolute -top-3 -left-3 w-12 h-12 rounded-md flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 dark:from-cyan-600 dark:to-blue-600 backdrop-blur-md border border-white/10 dark:border-white/5">
							<BarChart3 className="h-5 w-5 text-primary-foreground" />
						</div>

						<div className="ml-6 mt-2">
							<h3 className="text-xl font-semibold mb-2 text-card-foreground">
								Healthcare Budget
							</h3>
							<p className="text-sm text-muted-foreground mb-8 line-clamp-2">
								Plan and optimize your healthcare budget with intelligent
								allocation suggestions
							</p>
						</div>

						<div className="mt-auto">
							<Button
								className="w-full bg-gradient-to-r from-background ease-in to-background hover:from-cyan-500/80 hover:to-blue-500 border-border/30 transition-all cursor-pointer"
								variant="outline"
								onClick={() => navigate("/budget")}
							>
								Plan Budget
							</Button>
						</div>

						<div className="h-1.5 w-full absolute bottom-0 left-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:from-cyan-600/20 dark:to-blue-600/20 rounded-b-lg overflow-hidden">
							<motion.div
								initial={{ width: "0%" }}
								whileHover={{ width: "100%" }}
								className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 dark:from-cyan-600 dark:to-blue-600"
							/>
						</div>
					</motion.div>

					<motion.div
						className="group relative flex flex-col p-6 rounded-lg bg-card/80 backdrop-blur-md border border-border/50 shadow-md cursor-pointer"
						onClick={() => navigate("/epidemic")}
					>
						<div className="absolute -top-3 -left-3 w-12 h-12 rounded-md flex items-center justify-center bg-gradient-to-br from-red-400 to-amber-500 dark:from-red-600 dark:to-amber-600 backdrop-blur-md border border-white/10 dark:border-white/5">
							<Biohazard className="h-5 w-5 text-primary-foreground" />
						</div>

						<div className="ml-6 mt-2">
							<h3 className="text-xl font-semibold mb-2 text-card-foreground">
								Epidemic Control
							</h3>
							<p className="text-sm text-muted-foreground mb-8 line-clamp-2">
								Monitor and manage epidemic situations with data-driven insights
								and recommendations
							</p>
						</div>

						<div className="mt-auto">
							<Button
								className="cursor-pointer w-full bg-gradient-to-r from-background to-background hover:from-red-500/80 hover:to-amber-500 border-border/30 transition-all"
								variant="outline"
								onClick={() => navigate("/epidemic")}
							>
								Manage Epidemic
							</Button>
						</div>

						<div className="h-1.5 w-full absolute bottom-0 left-0 bg-gradient-to-r from-red-400/20 to-amber-500/20 dark:from-red-600/20 dark:to-amber-600/20 rounded-b-lg overflow-hidden">
							<motion.div
								initial={{ width: "0%" }}
								whileHover={{ width: "100%" }}
								className=" h-full bg-gradient-to-r from-red-400 to-amber-500 dark:from-red-600 dark:to-amber-600"
							/>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}

export default App;
