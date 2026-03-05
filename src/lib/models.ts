import mongoose, { type Document, Schema } from "mongoose";

// --- CLIENT ---
export interface IClient extends Document {
	name: string;
	email?: string;
	phone?: string;
	address?: string;
	company?: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}
const clientSchema = new Schema<IClient>(
	{
		name: { type: String, required: true },
		email: String,
		phone: String,
		address: String,
		company: String,
		notes: String,
	},
	{ timestamps: true },
);

export const Client =
	mongoose.models.Client || mongoose.model<IClient>("Client", clientSchema);

// --- PERSONNEL ---
export interface IPersonnel extends Document {
	name: string;
	email: string;
	role?: "admin" | "architect" | "designer" | "legal" | "external";
	authUserId?: string; // Better-auth user ID
	avatarUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}
const personnelSchema = new Schema<IPersonnel>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		role: {
			type: String,
			enum: ["admin", "architect", "designer", "legal", "external"],
			default: "architect",
		},
		authUserId: String,
		avatarUrl: String,
	},
	{ timestamps: true },
);

export const Personnel =
	mongoose.models.Personnel ||
	mongoose.model<IPersonnel>("Personnel", personnelSchema);

// --- PROJECT ---
export interface IProject extends Document {
	name: string;
	description?: string;
	status?: "lead" | "active" | "completed" | "on_hold" | "cancelled";
	client: mongoose.Types.ObjectId | IClient;
	startDate?: Date;
	endDate?: Date;
	createdAt: Date;
	updatedAt: Date;
	assignments?: mongoose.Types.ObjectId[];
}
const projectSchema = new Schema<IProject>(
	{
		name: { type: String, required: true },
		description: String,
		status: {
			type: String,
			enum: ["lead", "active", "completed", "on_hold", "cancelled"],
			default: "lead",
		},
		client: { type: Schema.Types.ObjectId, ref: "Client" },
		startDate: Date,
		endDate: Date,
		assignments: [{ type: Schema.Types.ObjectId, ref: "Personnel" }],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

export const Project =
	mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

// --- DOCUMENT ---
export interface IDocument extends Document {
	projectId: mongoose.Types.ObjectId | IProject;
	title: string;
	storagePath: string;
	fileType?: string;
	metadata?: any;
	createdAt: Date;
}
const documentSchema = new Schema<IDocument>(
	{
		projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		title: { type: String, required: true },
		storagePath: { type: String, required: true },
		fileType: String,
		metadata: Schema.Types.Mixed,
	},
	{ timestamps: true },
);

export const ProjectDocument =
	mongoose.models.Document ||
	mongoose.model<IDocument>("Document", documentSchema);

// --- TRANSACTION ---
export interface ITransaction extends Document {
	projectId: mongoose.Types.ObjectId | IProject;
	type: "income" | "expense";
	amount: number;
	category: string;
	description?: string;
	date: Date;
}
const transactionSchema = new Schema<ITransaction>(
	{
		projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
		type: { type: String, enum: ["income", "expense"], required: true },
		amount: { type: Number, required: true },
		category: { type: String, required: true },
		description: String,
		date: { type: Date, required: true, default: Date.now },
	},
	{ timestamps: true },
);

export const Transaction =
	mongoose.models.Transaction ||
	mongoose.model<ITransaction>("Transaction", transactionSchema);

// --- TODO ---
export interface ITodo extends Document {
	title: string;
	isCompleted: boolean;
	createdAt: Date;
}
const todoSchema = new Schema<ITodo>(
	{
		title: { type: String, required: true },
		isCompleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

export const Todo =
	mongoose.models.Todo || mongoose.model<ITodo>("Todo", todoSchema);

// --- ACTIVITY ---
export interface IActivity extends Document {
	userId?: string; // Better-auth user ID
	action: string;
	entityType?: string;
	entityId?: string;
	details?: any;
}
const activitySchema = new Schema<IActivity>(
	{
		userId: String,
		action: { type: String, required: true },
		entityType: String,
		entityId: String,
		details: Schema.Types.Mixed,
	},
	{ timestamps: true },
);

export const Activity =
	mongoose.models.Activity ||
	mongoose.model<IActivity>("Activity", activitySchema);

// --- CHAT SESSION ---
export interface IChatMessage extends Document {
	sessionId: mongoose.Types.ObjectId;
	role: "user" | "assistant" | "system";
	content: string;
}
const chatMessageSchema = new Schema<IChatMessage>(
	{
		sessionId: {
			type: Schema.Types.ObjectId,
			ref: "ChatSession",
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "assistant", "system"],
			required: true,
		},
		content: { type: String, required: true },
	},
	{ timestamps: true },
);

export const ChatMessage =
	mongoose.models.ChatMessage ||
	mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);

export interface IChatSession extends Document {
	userId: string;
	topic?: string;
	messages: IChatMessage[];
}
const chatSessionSchema = new Schema<IChatSession>(
	{
		userId: { type: String, required: true },
		topic: String,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

chatSessionSchema.virtual("messages", {
	ref: "ChatMessage",
	localField: "_id",
	foreignField: "sessionId",
});
export const ChatSession =
	mongoose.models.ChatSession ||
	mongoose.model<IChatSession>("ChatSession", chatSessionSchema);

// --- AI USAGE ---
export interface IAIUsage extends Document {
	authUserId?: string;
	aiModel: string;
	promptTokens: number;
	completionTokens: number;
	totalTokens: number;
	cost: number;
	purpose: string;
}
const aiUsageSchema = new Schema<IAIUsage>(
	{
		authUserId: String,
		aiModel: { type: String, required: true },
		promptTokens: { type: Number, required: true },
		completionTokens: { type: Number, required: true },
		totalTokens: { type: Number, required: true },
		cost: { type: Number, required: true },
		purpose: { type: String, required: true },
	},
	{ timestamps: true },
);

export const AIUsage =
	mongoose.models.AIUsage || mongoose.model<IAIUsage>("AIUsage", aiUsageSchema);

// --- AI SUMMARY ---
export interface IAISummary extends Document {
	documentId: mongoose.Types.ObjectId | IDocument;
	summary: string;
	aiModel: string;
}
const aiSummarySchema = new Schema<IAISummary>(
	{
		documentId: {
			type: Schema.Types.ObjectId,
			ref: "Document",
			required: true,
		},
		summary: { type: String, required: true },
		aiModel: String,
	},
	{ timestamps: true },
);

export const AISummary =
	mongoose.models.AISummary ||
	mongoose.model<IAISummary>("AISummary", aiSummarySchema);
