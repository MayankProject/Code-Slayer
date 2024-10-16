import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const db = new PrismaClient();

async function seedDatabase() {
	const baseDir = '/home/sergio/Code/Code-Smack/apps/frontend/problems';

	// Read directories
	const directories = fs.readdirSync(baseDir);

	for (const dir of directories) {
		const problemDir = path.join(baseDir, dir);

		// Check if it's a directory
		if (fs.statSync(problemDir).isDirectory()) {
			const problemFiles = fs.readdirSync(problemDir);
			let boilerCode = '';
			let description = '';
			let testBoilerCode = '';
			const testCases = [];

			for (const file of problemFiles) {
				const filePath = path.join(problemDir, file);

				// Read boilerplate code
				if (file === 'boiler.txt') {
					boilerCode = fs.readFileSync(filePath, 'utf-8');
				}

				// Read description
				if (file === 'description.txt') {
					description = fs.readFileSync(filePath, 'utf-8');
				}

				// Read test boiler code
				if (file === 'testBoilerCode.txt') {
					testBoilerCode = fs.readFileSync(filePath, 'utf-8');
				}

				// Read test cases
				if (file === 'testcases') {
					const testCaseDirs = fs.readdirSync(filePath);

					for (const testCaseDir of testCaseDirs) {
						const inputPath = path.join(filePath, testCaseDir, 'input.txt');
						const outputPath = path.join(filePath, testCaseDir, 'output.txt');

						const input = fs.readFileSync(inputPath, 'utf-8');
						const output = fs.readFileSync(outputPath, 'utf-8');

						testCases.push({ input, output });
					}
				}
			}

			// Create the problem in the database
			await db.problem.create({
				data: {
					title: dir,  // Use directory name as the title
					difficulty: "Easy", // Adjust based on your logic
					TestCases: {
						create: testCases,
					},
					boilerplate: boilerCode,
					testBiolerCode: testBoilerCode,
					description: description,
				},
			});
		}
	}
}

seedDatabase()
	.then(() => {
		console.log("Database seeding completed!");
	})
	.catch((error) => {
		console.error("Error seeding database:", error);
	})
	.finally(async () => {
		await db.$disconnect();
	});
