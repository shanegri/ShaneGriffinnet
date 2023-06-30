<template>
  <div class="pr-4" v-for="job in jobs" :key="job.id">
    <h3 class="text-white">{{ job.company }}</h3>
    <div class="flex">
      <div class="w-1/2 h-auto">
        <h4 class="text-gray-300 text-white text-sm">{{ job.role }}</h4>
      </div>
      <div class="w-1/2 h-auto">
        <p class="text-gray-300 text-xs text-right">{{ job.dates }}</p>
      </div>
    </div>
    <h3 class="text-white mb-2 text-xs">{{ job.skills }}</h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobs: [
        {
          id: 1,
          company: 'Largo Capital, Inc. - CREDIT',
          role: 'Full Stack Developer',
          dates: 'Jan 2019 - May 2020 | Sep 2022 - Current',
          skills: 'PHP, SQL, HTML/CSS/JS, CI/CD'
        },
        {
          id: 1,
          company: 'Northrop Grumman',
          role: 'Associate Software Engineer',
          dates: 'Jun 2020 - Aug 2022',
          skills: 'C/C++, SQL, Qt, Python, Bash, Linux'
        },
        {
          id: 1,
          company: 'University at Buffalo School of Engineering and Applied Sciences',
          role: 'Web Developer Intern',
          dates: 'May 2018 - May 2020',
          skills: 'PHP, SQL, HTML/CSS/JS, Python'
        },
        {
          id: 1,
          company: 'University at Buffalo',
          role: 'CSE 115/116 Teaching Assistant',
          dates: 'Aug 2017 - May 2018',
          skills: 'Java'
        }
      ]
    }
  }
}
</script>
