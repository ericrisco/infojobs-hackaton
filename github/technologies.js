const GITHUB_REPOS_URL = "https://api.github.com/users/##USERNAME##/repos";

async function getGithubUsedTechnologies(username) {
    const url = GITHUB_REPOS_URL.replace('##USERNAME##', username);
    const headers = {
        Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    };
    
    try {
        const response = await fetch(url, { headers });
        const repos = await response.json();
        
        const languages = repos.map(repo => repo.language);
        const uniqueLanguages = [...new Set(languages)];
        return uniqueLanguages.join(', ').replaceAll(', ,', ',');
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
	getGithubUsedTechnologies
};
