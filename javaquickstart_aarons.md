# Vendor-Agnostic Java Project Setup, GitHub Push, and Quick Deployment

**Table of Contents**  
1. [Set Up a Vendor-Agnostic Java Environment](#1-set-up-a-vendor-agnostic-java-environment)  
   1.1 [Install a JDK](#11-install-a-jdk)  
   1.2 [Choose a Build Tool (Maven or Gradle)](#12-choose-a-build-tool-maven-or-gradle)  
   1.3 [IDE or Text Editor Usage](#13-ide-or-text-editor-usage)  
2. [Push Your Project to GitHub](#2-push-your-project-to-github)  
3. [Fastest Way to Deploy on Another Local Machine](#3-fastest-way-to-deploy-on-another-local-machine)  
4. [Summary](#4-summary)

---

## 1. Set Up a Vendor-Agnostic Java Environment

### 1.1 Install a JDK

You’ll need a Java Development Kit (JDK) installed. Common distributions:

- [Adoptium Temurin](https://adoptium.net/) (OpenJDK-based)  
- [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) (proprietary licensing for certain versions)  
- [Azul Zulu](https://www.azul.com/downloads/) (OpenJDK-based)  

**Set `JAVA_HOME`** (especially on Windows):  
1. Open *Control Panel* → *System* → *Advanced system settings* → *Environment Variables*.  
2. Create or edit a `JAVA_HOME` variable pointing to your JDK folder (e.g., `C:\Program Files\Java\jdk-17.0.2`).  
3. Append `;%JAVA_HOME%\bin` to the system `Path`.

### 1.2 Choose a Build Tool (Maven or Gradle)

Using either Maven or Gradle keeps your environment flexible. Any modern IDE or even a text editor can work if your project is built using one of these tools.

#### Quick-Start with Maven

1. **Install Maven**  
   - Download from [Maven’s official site](https://maven.apache.org/download.cgi). Unzip and add `bin` to your `PATH`.  
2. **Create a new Maven project**:
   ```bash
   mvn archetype:generate -DgroupId=com.mycompany.app \
       -DartifactId=my-app \
       -DarchetypeArtifactId=maven-archetype-quickstart \
       -DarchetypeVersion=1.4 \
       -DinteractiveMode=false
