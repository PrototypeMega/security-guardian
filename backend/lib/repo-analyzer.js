const chalk = require('chalk');

/**
 * Repository Analyzer
 * Analyzes repository structure to detect tech stack, project type, etc.
 */
class RepoAnalyzer {
  /**
   * Analyze repository metadata
   * Returns structured analysis of repo
   */
  static analyzeRepo(projectInfo, repoTree, readmeContent, packageJsonContent) {
    const analysis = {
      name: projectInfo.name || 'Unknown Project',
      description: projectInfo.description || 'No description provided',
      languages: this.detectLanguages(repoTree),
      stack: this.detectStack(packageJsonContent, repoTree),
      projectType: this.detectProjectType(packageJsonContent, repoTree, readmeContent),
      structure: this.formatStructure(repoTree),
      readmeExcerpt: this.extractReadmeExcerpt(readmeContent),
      mainFiles: this.identifyMainFiles(repoTree),
      hasTests: this.detectTests(repoTree),
      testFramework: this.detectTestFramework(packageJsonContent),
      ci: this.detectCI(repoTree),
      license: projectInfo.license_type || 'Not specified'
    };

    return analysis;
  }

  /**
   * Detect primary languages used in repository
   */
  static detectLanguages(repoTree) {
    const extensions = {};

    for (const file of repoTree) {
      if (file.type === 'blob') {
        const ext = file.name.split('.').pop();
        extensions[ext] = (extensions[ext] || 0) + 1;
      }
    }

    // Map extensions to languages
    const extToLang = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'py': 'Python',
      'go': 'Go',
      'rs': 'Rust',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'rb': 'Ruby',
      'php': 'PHP',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'sh': 'Shell',
      'jsx': 'React',
      'tsx': 'React TypeScript',
      'vue': 'Vue',
      'json': 'JSON',
      'yaml': 'YAML',
      'yml': 'YAML'
    };

    const languages = [];
    const sorted = Object.entries(extensions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    for (const [ext, count] of sorted) {
      const lang = extToLang[ext];
      if (lang && !languages.includes(lang)) {
        languages.push(lang);
      }
    }

    return languages.length > 0 ? languages : ['Unknown'];
  }

  /**
   * Detect tech stack from package.json and files
   */
  static detectStack(packageJsonContent, repoTree) {
    const stack = [];

    if (packageJsonContent) {
      try {
        const pkg = typeof packageJsonContent === 'string'
          ? JSON.parse(packageJsonContent)
          : packageJsonContent;

        // Check for major frameworks
        if (pkg.dependencies) {
          const deps = Object.keys(pkg.dependencies);

          if (deps.includes('react')) stack.push('React');
          if (deps.includes('vue')) stack.push('Vue');
          if (deps.includes('angular')) stack.push('Angular');
          if (deps.includes('express')) stack.push('Express.js');
          if (deps.includes('fastify')) stack.push('Fastify');
          if (deps.includes('next')) stack.push('Next.js');
          if (deps.includes('nuxt')) stack.push('Nuxt');
          if (deps.includes('django')) stack.push('Django');
          if (deps.includes('flask')) stack.push('Flask');
          if (deps.includes('fastapi')) stack.push('FastAPI');
          if (deps.includes('postgresql')) stack.push('PostgreSQL');
          if (deps.includes('mongoose')) stack.push('MongoDB');
          if (deps.includes('typeorm')) stack.push('TypeORM');
        }
      } catch (e) {
        // Invalid JSON, continue
      }
    }

    // Check filesystem for hints
    const fileNames = new Set(repoTree.map(f => f.name.toLowerCase()));
    if (fileNames.has('dockerfile')) stack.push('Docker');
    if (fileNames.has('docker-compose.yml') || fileNames.has('docker-compose.yaml')) stack.push('Docker Compose');
    if (fileNames.has('kubernetes.yml')) stack.push('Kubernetes');
    if (fileNames.has('.github')) stack.push('GitHub Actions');
    if (fileNames.has('.gitlab-ci.yml')) stack.push('GitLab CI');
    if (fileNames.has('terraform')) stack.push('Terraform');

    return stack.length > 0 ? stack : ['Node.js'];
  }

  /**
   * Detect project type (app, library, CLI, etc.)
   */
  static detectProjectType(packageJsonContent, repoTree, readmeContent) {
    let type = 'Library';

    if (packageJsonContent) {
      try {
        const pkg = typeof packageJsonContent === 'string'
          ? JSON.parse(packageJsonContent)
          : packageJsonContent;

        if (pkg.bin) type = 'CLI Tool';
        if (pkg.main === 'index.js' && pkg.scripts?.start) type = 'Web Application';
        if (pkg.type === 'module') type = 'ES Module';
      } catch (e) {
        // Continue
      }
    }

    // Check README hints
    if (readmeContent) {
      const content = readmeContent.toLowerCase();
      if (content.includes('web') && content.includes('app')) type = 'Web Application';
      if (content.includes('cli')) type = 'CLI Tool';
      if (content.includes('sdk')) type = 'SDK/Library';
      if (content.includes('framework')) type = 'Framework';
    }

    return type;
  }

  /**
   * Detect test framework
   */
  static detectTestFramework(packageJsonContent) {
    if (!packageJsonContent) return null;

    try {
      const pkg = typeof packageJsonContent === 'string'
        ? JSON.parse(packageJsonContent)
        : packageJsonContent;

      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.jest) return 'Jest';
      if (deps.mocha) return 'Mocha';
      if (deps.vitest) return 'Vitest';
      if (deps.pytest) return 'pytest';
      if (deps.rspec) return 'RSpec';
    } catch (e) {
      // Continue
    }

    return null;
  }

  /**
   * Detect CI/CD pipeline
   */
  static detectCI(repoTree) {
    const fileNames = new Set(repoTree.map(f => f.path.toLowerCase()));

    if (fileNames.has('.github/workflows')) return 'GitHub Actions';
    if (fileNames.has('.gitlab-ci.yml')) return 'GitLab CI';
    if (fileNames.has('circle.yml')) return 'CircleCI';
    if (fileNames.has('travis.yml')) return 'Travis CI';
    if (fileNames.has('jenkins')) return 'Jenkins';

    return null;
  }

  /**
   * Check if repository has tests
   */
  static detectTests(repoTree) {
    const paths = repoTree.map(f => f.path.toLowerCase());
    return paths.some(p =>
      p.includes('/test') ||
      p.includes('/tests') ||
      p.includes('/__tests__') ||
      p.includes('.test.') ||
      p.includes('.spec.')
    );
  }

  /**
   * Identify main entry files
   */
  static identifyMainFiles(repoTree) {
    const mainFiles = [];
    const fileNames = repoTree.map(f => f.name);

    const important = ['README.md', 'package.json', 'Dockerfile', '.gitlab-ci.yml', 'tsconfig.json'];
    for (const name of important) {
      if (fileNames.includes(name)) {
        mainFiles.push(name);
      }
    }

    return mainFiles;
  }

  /**
   * Extract first 500 chars of README for context
   */
  static extractReadmeExcerpt(readmeContent) {
    if (!readmeContent) return null;

    // Remove markdown headers and extra whitespace
    let excerpt = readmeContent
      .split('\n')
      .filter(line => !line.startsWith('#'))
      .join('\n')
      .substring(0, 500)
      .trim();

    // Remove trailing incomplete words
    if (excerpt.length === 500) {
      const lastSpace = excerpt.lastIndexOf(' ');
      if (lastSpace > 0) {
        excerpt = excerpt.substring(0, lastSpace) + '...';
      }
    }

    return excerpt;
  }

  /**
   * Format repo structure as ASCII tree
   */
  static formatStructure(repoTree) {
    if (!repoTree || repoTree.length === 0) {
      return 'Empty repository';
    }

    // Group by directories
    const dirs = new Set();
    const files = [];

    for (const item of repoTree.slice(0, 20)) { // Limit to 20 items for readability
      if (item.type === 'tree') {
        dirs.add(item.name + '/');
      } else {
        files.push(item.name);
      }
    }

    let structure = '';
    for (const dir of Array.from(dirs).sort()) {
      structure += `📁 ${dir}\n`;
    }
    for (const file of files.sort().slice(0, 10)) {
      structure += `📄 ${file}\n`;
    }

    if (repoTree.length > 20) {
      structure += `... and ${repoTree.length - 20} more items\n`;
    }

    return structure;
  }
}

module.exports = RepoAnalyzer;
