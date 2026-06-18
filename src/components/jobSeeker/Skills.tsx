import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useFormContext } from "react-hook-form"

function SkillsEdit() {
    const { register } = useFormContext()

    return (
        <div className="flex flex-col gap-6 w-full py-2">
            <div className="relative">
                <Input
                    placeholder="Ex: Frontend Developer, Full Stack Engineer"
                    className="h-11 rounded-sm border border-[#A5A5A5] focus-visible:ring-0 focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]"
                    type="text"
                    {...register("skills.technical")}
                />
                <Label className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium">
                    Technical Focus
                </Label>
            </div>

      
            <div className="relative">
                <Input
                    placeholder="Ex: React, Next.js, Node.js, AWS (comma separated)"
                    className="h-11 rounded-sm border border-[#A5A5A5] focus-visible:ring-0 focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]"
                    type="text"
                    {...register("skills.tools_and_platforms")}
                />
                <Label className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium">
                    Tools & Platforms
                </Label>
            </div>

            <div className="relative">
                <Input
                    placeholder="Ex: Agile, Scrum, CI/CD, TDD (comma separated)"
                    className="h-11 rounded-sm border border-[#A5A5A5] focus-visible:ring-0 focus-visible:border-gray-700 w-full placeholder:text-[#A5A5A5]"
                    type="text"
                    {...register("skills.methodologies")}
                />
                <Label className="absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-sm text-joblin-dark-gray font-medium">
                    Methodologies
                </Label>
            </div>
        </div>
    )
}

export default SkillsEdit