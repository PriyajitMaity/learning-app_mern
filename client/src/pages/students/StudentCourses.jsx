import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseList } from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const createSearchParamsHelper = (filtersParams) => {
  const query = [];
  for (const [key, value] of Object.entries(filtersParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      query.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }
  return query.join("&");
};

const StudentCourses = () => {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate =useNavigate();

  const { studentCourseList, setStudentCourseList, loading, setLoading } = useContext(StudentContext);

  const handleFilterOnChange = (getKeyItem, getOption) => {
    let copyFilter = { ...filters };
    const indexOfKeyItem = Object.keys(copyFilter).indexOf(getKeyItem);
    // console.log(indexOfKeyItem, getKeyItem);
    if (indexOfKeyItem === -1) {
      copyFilter = { ...copyFilter, [getKeyItem]: [getOption.id] };
      // console.log(copyFilter);
    } else {
      const indexOfOption = copyFilter[getKeyItem].indexOf(getOption.id);
      if (indexOfOption === -1) copyFilter[getKeyItem].push(getOption.id);
      else copyFilter[getKeyItem].splice(indexOfOption, 1);
    }
    setFilters(copyFilter);
    sessionStorage.setItem("filters", JSON.stringify(copyFilter));
  };

  const fetchAllCourseList = async (filters, sort) => { 
    const query =new URLSearchParams({...filters, sortBy: sort});

    const response = await fetchStudentCourseList(query);
    if (response?.success) {
      setStudentCourseList(response?.data);
      setLoading(false);
    }
    // console.log(response.data);
  };

  useEffect(() => {
    const buildQuery = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQuery));
  }, [filters]);

  useEffect(() => {
    if(filters !== null && sort !== null)
    fetchAllCourseList(filters, sort);
  }, [filters, sort]);

  useEffect(() =>{
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
  }, [])

  useEffect(() =>{
    sessionStorage.removeItem("filters")
  }, []);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div>
            {Object.keys(filterOptions).map((keyItem) => (
              <div className="p-4 border-b">
                <h3 className="font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mb-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label className="flex font-medium items-center gap-3">
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 p-5">
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                  {sortOptions.map((item) => (
                    <DropdownMenuRadioItem value={item.id} key={item.id}>
                      {item.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">{studentCourseList.length}Results</span>
          </div>
          <div className="space-y-4">
            {studentCourseList && studentCourseList.length > 0 ? (
              studentCourseList.map((item) => (
                <Card key={item?._id} className="cursor-pointer" onClick={() =>navigate(`/courses/details/${item._id}`)}>
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img src={item?.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item?.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        created by <span className="font-bold">{item?.instructorName}</span>
                      </p>
                      <p className="text-[16px] text-violet-600 mt-3 mb-2">
                        {`${item?.curriculum?.length} ${
                          item?.curriculum.length <= 1 ? "Lecture" : "Lectures"
                        } - ${item?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">${item?.pricing}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              loading ? <Skeleton /> :
              <h1 className="font-extrabold text-4xl">Not Found</h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentCourses;
