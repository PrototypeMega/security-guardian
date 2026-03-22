const chalk = require('chalk');

class RepoAnalyzer {
  constructor() {
    this.languagePatterns = {
      'JavaScript/Node.js': ['package.json', '.js', '.ts', '.tsx'],
      'Python': ['requirements.txt', 'setup.py', 'pyproject.toml', '.py'],
      'Go': ['go.mod', 'go.sum', '.go'],
      'Rust': ['Cargo.toml', '.rs'],
      'Java': ['pom.xml', 'build.gradle', '.java'],
      'C#': ['.csproj', '.sln', '.cs'],
      'Ruby': ['Gemfile', '.rb'],
      'PHP': ['composer.json', '.php'],
      'Docker': ['Dockerfile', 'docker-compose.yml']
    };
  }

  analyzeRepository(treeData, readme, languages = {}) {
    console.log(chalk.cyan(`\n  🔍 Analyzing repository structure`));

    // Detect languages
    const detectedLanguages = this.detectLanguages(treeData, languages);
    console.log(chalk.gray(`     Languages: ${detectedLanguages.join(', ')}`));

    // Find key files
    const keyFiles = this.findKeyFiles(treeData);
    console.log(chalk.gray(`     Key files: ${keyFiles.join(', ')}`));

    // Create structure summary
    const structureSummary = this.createStructureSummary(treeData);

    return {
      name: 'Project',
      description: 'A software project',
      languages: detectedLanguages,
      keyFiles: keyFiles,
      structureSummary: structureSummary,
      readme: readme || ''
    };
  }

  detectLanguages(treeData, gitlabLanguages = {}) {
    const detected = new Set();

    // Add languages from GitLab API if available
    if (Object.keys(gitlabLanguages).length > 0) {
      Object.keys(gitlabLanguages).forEach(lang => detected.add(lang));
    }

    // Add languages detected from file patterns
    const fileNames = treeData.map(f => f.name).join(' ');
    
    for (const [language, patterns] of Object.entries(this.languagePatterns)) {
      for (const pattern of patterns) {
        if (fileNames.includes(pattern)) {
          detected.add(language);
          break;
        }
      }
    }

    return Array.from(detected).length > 0 ? Array.from(detected) : ['Unknown'];
  }

  findKeyFiles(treeData) {
    const keyFilePatterns = [
      'package.json',
      'README.md',
      'requirements.txt',
      '.env.example',
      'Dockerfile',
      'docker-compose.yml',
      'Makefile',
      'setup.py',
      'go.mod',
      'Cargo.toml'
    ];

    const found = [];
    const fileNames = new Set(treeData.map(f => f.name));

    for (const pattern of keyFilePatterns) {
      if (fileNames.has(pattern)) {
        found.push(pattern);
      }
    }

    return found.length > 0 ? found : ['package.json', 'README.md'];
  }

  createStructureSummary(treeData) {
    // Group files by directory
    const dirs = new Set();
    const topLevelDirs = new Set();

    treeData.forEach(item => {
      const path = item.path;
      const parts = path.split('/');
      
      if (parts.length > 1) {
        topLevelDirs.add(parts[0]);
      }
    });

    const dirList = Array.from(topLevelDirs).sort().slice(0, 15);
    
    if (dirList.length === 0) {
      return 'Single directory project with configuration files.';
    }

    return `\`\`\`
${dirList.map(d => `${d}/`).join('\n')}
...(and more)
\`\`\``;
  }
}

module.exports = RepoAnalyzer;
