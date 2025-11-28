import fs from "fs";
import path from "path";

class MarkdownService {
  private coursesDirectory = process.env.COURSES_PATH || "";

  async getMarkdownLessonList(): Promise<string[]> {
    const exactCoursePath = path.join(this.coursesDirectory);

    if (!fs.existsSync(exactCoursePath)) {
      return [];
    }

    return this.getMarkdownFilePathsAsync(exactCoursePath);
  }

  async getMarkdownLessonContent(filePath: string) {
    const lessonRelativePath = filePath;

    if (!lessonRelativePath) {
      throw new Error("File path is required.");
    }

    const fullPath = path.join(this.coursesDirectory, lessonRelativePath);
    const resolvedPath = path.resolve(fullPath);

    if (!resolvedPath.startsWith(path.resolve(this.coursesDirectory))) {
      throw new Error("Forbidden: Access is denied.");
    }

    try {
      await fs.promises.access(fullPath, fs.constants.F_OK);
      const content = await fs.promises.readFile(fullPath, "utf-8");
      return content;
    } catch (error: any) {
      if (error.code === "ENOENT") {
        throw new Error("Lesson file not found.");
      }
      console.error("Error reading lesson file:", error);
      throw new Error("Could not read lesson file.");
    }
  }

  private async getMarkdownFilePathsAsync(dirPath: string): Promise<string[]> {
    const stats = await fs.promises.stat(dirPath);

    if (!stats.isDirectory()) {
      if (dirPath.endsWith(".md")) {
        return [path.relative(this.coursesDirectory, dirPath)];
      }
      return [];
    }

    const childNames = await fs.promises.readdir(dirPath);
    const paths = await Promise.all(
      childNames.map((child) =>
        this.getMarkdownFilePathsAsync(path.join(dirPath, child))
      )
    );

    return paths.flat();
  }
}

export const markdownService = new MarkdownService();
